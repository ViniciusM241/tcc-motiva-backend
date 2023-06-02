const MessagingResponse = require('twilio').twiml.MessagingResponse;
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio');

class TwillioService {
  constructor({
    phraseModel,
    userModel,

    userService,
    messageService,
    scheduleService,
    userRepository,
    scheduleRepository,
    messageRepository,
    evaluationRepository,

    messages,
  }) {
    this.phraseModel = phraseModel.sequelize();
    this.userModel = userModel.sequelize();

    this.userService = userService;
    this.messageService = messageService;
    this.scheduleService = scheduleService;
    this.userRepository = userRepository;
    this.scheduleRepository = scheduleRepository;
    this.messageRepository = messageRepository;
    this.evaluationRepository = evaluationRepository;

    this.messages = messages;

    this.client = client(accountSid, authToken);
  }

  async handleRegister(body) {
    const user = await this.findUserByWaId(body.WaId);
    const lastMessage = await this.messageService.getLastMessageSent(user.id);

    if (user.profileCompleted) {
      await this.userService.updateStatus(user.id, 'STAND_BY');

      return this.messages.register.done(user.name);
    }

    if (lastMessage?.text === this.messages.register.welcome()) {
      await this.userRepository.update(
        user.id,
        {
          name: body.Body,
        }
      );

      return this.messages.register.askSchedule(body.Body);
    }

    if (
      lastMessage?.text === this.messages.register.askSchedule(user.name) ||
      lastMessage?.text === this.messages.register.wrongSchedule()
    ) {
      const messageSchedule = this.userService.handleSchedule(body.Body);

      if (!messageSchedule) return this.messages.register.wrongSchedule();

      await this.userRepository.update(
        user.id,
        {
          messageSchedule,
          profileCompleted: true,
        }
      );

      await this.userService.updateStatus(user.id, 'STAND_BY');

      return this.messages.register.done(user.name, messageSchedule);
    }

    return this.messages.register.welcome();
  }

  async handleStandBy(body) {
    const user = await this.findUserByWaId(body.WaId);
    const menu = this.messages.actionMenu;
    const message = this._generateMenu(user, menu);

    await this.userService.updateStatus(user.id, 'MENU');

    return message;
  }

  async handleMenu(body) {
    const user = await this.findUserByWaId(body.WaId);
    const menu = this.messages.actionMenu;
    const action = menu.items[body.Body]?.action;

    if (!action) {
      return [
        this.messages.actionMenu.itemNotFound(),
        this._generateMenu(user, menu)
      ];
    }

    const _action = this.handleMenuActions(action);

    return await _action(body, user);
  }

  handleMenuActions(action) {
    const actions = {
      'view-profile': async (body, user) => await this.viewProfile(body, user),
      'unsubscribe': async (body, user) => await this.unsubscribe(body, user),
      'update-profile': async (body, user) => await this.updateProfile(body, user),
    };

    return actions[action];
  }

  async handleEvaluation(body) {
    const grade = body.Body;
    const user = await this.findUserByWaId(body.WaId);

    if (isNaN(grade) || grade < 0 || grade > 5) {
      return [
        this.messages.evaluation.invalidGrade(),
        this.messages.evaluation.tryAgain(user.name)
      ];
    }

    const evaluation = await this.evaluationRepository.findOne({
      where: {
        userId: user.id,
        status: 'PENDING',
      }
    });

    await this.evaluationRepository.update(evaluation.id, {
      grade,
      status: 'EVALUATED'
    });

    await this.userService.updateStatus(user.id, 'STAND_BY');

    return this.messages.evaluation.success();
  }

  async handleUpdateProfile(body) {
    const user = await this.findUserByWaId(body.WaId);

    return await this.updateProfile(body, user);
  }

  async updateProfile(body, user) {
    const lastMessage = await this.messageService.getLastMessageSent(user.id);
    const menu = this.messages.updateProfileMenu;
    const menuMessage = this._generateMenu(user, menu);

    if (user.status !== 'UPDATE_PROFILE') {
      await this.userService.updateStatus(user.id, 'UPDATE_PROFILE');

      return menuMessage;
    }

    if (lastMessage?.text === menuMessage) {
      if (menu.items[body.Body]) {
        return this.messages.updateProfileMenu.askNewValue();
      } else {
        return [
          this.messages.updateProfileMenu.itemNotFound(),
          menuMessage
        ];
      }
    } else {
      const lastMessageReceived = await this.messageService.getLastMessageReceived(user.id);

      if (!menu.items[lastMessageReceived?.text]) {
        return [
          this.messages.updateProfileMenu.itemNotFound(),
          menuMessage
        ];
      }

      const action = menu.items[lastMessageReceived?.text].action;

      if (action === 'messageSchedule') {
        body.Body = this.userService.handleSchedule(body.Body);

        if (!body.Body) {
          await this.userService.updateStatus(user.id, 'UPDATE_PROFILE');

          return [
            this.messages.updateProfileMenu.fail(),
            menuMessage
          ];
        }
      }

      await this.userRepository.update(
        user.id,
        {
          [action]: body.Body,
        }
      );

      await this.userService.updateStatus(user.id, 'STAND_BY');

      return this.messages.updateProfileMenu.success();
    }
  }

  async viewProfile(body, user) {
    await this.userService.updateStatus(user.id, 'STAND_BY');

    return this.messages.profile(user);
  }

  async unsubscribe(body, user) {
    await this.userRepository.destroy(user.id);
    const schedules = await this.scheduleRepository.findAll({
      where: {
        userId: user.id,
      },
      raw: true,
    });

    Promise.all(
      schedules.map(async (schedule) => {
        await this.scheduleRepository.destroy(schedule.id);
      })
    );

    return this.messages.unsubscribe();
  }

  _generateMenu(user, menu) {
    const items = Object.keys(menu.items);
    let message = menu.description(user.name);

    items.forEach(item => {
      message += `\n*${item}* - ${menu.items[item].text}`;
    });

    return message;
  }

  async findUserByWaId(id) {
    return await this.userRepository.findOne({
      where: {
        phoneNumber: id,
      },
      raw: true,
    });
  }

  async sendMessageBack(message, waId, res) {
    const twiml = new MessagingResponse();
    const user = await this.findUserByWaId(waId);
    const id = user?.id ? user.id : waId;

    if (Array.isArray(message) && message.length) {
      for (const _message of message) {
        await this.messageService.registerOutgoingMessage(_message, id);

        twiml.message(_message);
      }
    } else {
      await this.messageService.registerOutgoingMessage(message, id);

      twiml.message(message);
    }

    res.set({'Content-Type': 'text/xml'});

    return res.end(twiml.toString());
  }

  async generateMessageWithPhrase(scheduleId) {
    const schedule = await this.scheduleRepository.findById(scheduleId, {
      include: [
        {
          model: this.userModel,
          as: 'users',
        },
        {
          model: this.phraseModel,
          as: 'phrases',
        },
      ],
    });

    if (!schedule.users || !schedule.phrases) return;

    const message = `"${schedule.phrases.text}"\n\n- *_${schedule.phrases.author}_*`;

    await this.userService.updateStatus(schedule.users.id, 'EVALUATION_WAITING');

    const messageStatus = await this.sendMessage(message, schedule.users, `/messages-schedule-callback/${schedule.id}`);

    if (messageStatus === 'sent') {
      await this.scheduleRepository.update(schedule.id, {
        success: true,
      });
    }
  }

  async forceEvaluation(body) {
    const user = await this.findUserByWaId(body.WaId);

    const lastSchedule = await this.scheduleService.lastSchedule(user.id);

    if (!lastSchedule) return;

    const message = this.messages.evaluation.askEvaluation(user.name);

    await this.evaluationRepository.create({
      userId: user.id,
      phraseId: lastSchedule.phraseId,
      status: 'PENDING',
    });

    await this.userService.updateStatus(user.id, 'EVALUATION');

    return message;
  }

  async handleSendingEvaluations(user) {
    const lastSchedule = await this.scheduleService.lastSchedule(user.id);

    if (!lastSchedule) return;

    const message = this.messages.evaluation.askEvaluation(user.name);

    await this.sendMessage(message, user, `/messages-callback`);

    await this.evaluationRepository.create({
      userId: user.id,
      phraseId: lastSchedule.phraseId,
      status: 'PENDING',
    });

    await this.userService.updateStatus(user.id, 'EVALUATION');
  }

  async sendMessage(message, { id, phoneNumber }, callback) {
    await this.messageService.registerOutgoingMessage(message, id);

    const messageInfo = await this.client.messages
      .create({
        from: `whatsapp:+${process.env.TWILIO_PHONE_NUMBER}`,
        body: message,
        to: `whatsapp:+${phoneNumber}`,
        statusCallback: `${process.env.BASE_URL}${callback}`,
      });

    return messageInfo.status;
  }

  async confirmScheduleMessageSent(scheduleId, body) {
    if (body.SmsStatus === 'sent') {
      await this.scheduleRepository.update(scheduleId, {
        success: true,
      });

      await this.confirmMessageSent(body);
    }
  }

  async confirmMessageSent(body) {
    const waId = body.To.replace('whatsapp:+', '');
    const user = await this.findUserByWaId(waId);

    if (Object.prototype.hasOwnProperty.call(user, 'id')) {
      const lastMessageSent = await this.messageService.getLastMessageSent(user.id);

      await this.messageRepository.update(lastMessageSent.id, {
        success: true,
      });
    }
  }

}

module.exports.default = TwillioService;
