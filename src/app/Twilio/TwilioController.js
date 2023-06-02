class TwilioController {
  constructor({
    twilioService,
    userService,
    messageService,

    messages,
  }){
    this.twilioService = twilioService;
    this.userService = userService;
    this.messageService = messageService;

    this.messages = messages;
  }

  async router(userStatus, body) {
    switch(userStatus) {
      case 'REGISTER': return await this.twilioService.handleRegister(body);
      case 'STAND_BY': return await this.twilioService.handleStandBy(body);
      case 'MENU': return await this.twilioService.handleMenu(body);
      case 'UPDATE_PROFILE': return await this.twilioService.handleUpdateProfile(body);
      case 'EVALUATION': return await this.twilioService.handleEvaluation(body);
      case 'EVALUATION_WAITING': return await this.twilioService.forceEvaluation(body);
      default: return;
    }
  }

  async routerTwilioMessages(req, res) {
    try {
      const body = req.body();
      let user = await this.twilioService.findUserByWaId(body.WaId);

      if (!user) {
        user = await this.userService.create({
          name: 'PENDING',
          phoneNumber: body.WaId,
          messageSchedule: 'PENDING',
        });
      }

      const message = await this.router(user.status, body);

      await this.messageService.registerIncomingMessage(body.Body, user.id);

      return await this.twilioService.sendMessageBack(message, body.WaId, res);
    } catch(err) {
      console.log(err);

      return this.twilioService.sendMessageBack(this.messages.error(), res);
    }
  }

  async scheduleMessageCallback(req, res) {
    const { id } = req.params();
    const body = req.body();

    await this.twilioService.confirmScheduleMessageSent(id, body);
  }

  async messageCallback(req, res) {
    const body = req.body();

    await this.twilioService.confirmMessageSent(body);
  }
}

module.exports.default = TwilioController;
