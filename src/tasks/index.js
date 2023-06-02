const schedule = require('node-schedule');
const { Op } = require('sequelize');
const moment = require('moment');

class Tasks {
  constructor({
    userService,
    userRepository,
    messageService,
    phraseService,
    scheduleRepository,
    evaluationRepository,
    twilioService,

    Sequelize,
  }) {
    this.userService = userService;
    this.messageService = messageService;
    this.phraseService = phraseService;
    this.userRepository = userRepository;
    this.scheduleRepository = scheduleRepository;
    this.evaluationRepository = evaluationRepository;
    this.twilioService = twilioService;

    this.sequelize = Sequelize;
  }

  init() {
    if (process.env.ENABLE_TASKS === 'true') {
      this.setUsersToStandBy();
      this.verifyPastSchedule();
    }

    if (process.env.ENABLE_SEND_PHRASES === 'true') {
      this.handleSendingPhrases();
      this.handleEvaluations();
    }
  }

  async verifyPastSchedule() {
    const schedules = await this.scheduleRepository.findAll({
      where: {
        success: false,
        fireDateTime: {
          [Op.lt]: new Date()
        },
      }
    });

    await Promise.all(
      schedules.map(async (schedule) => {
        await this.scheduleRepository.destroy(schedule.id);
      })
    );
  }

  handleSendingPhrases() {
    return schedule.scheduleJob('*/1 * * * *', async () => {
      await this.scheduleSendingPhrases();
      await this.verifySchedules();
    });
  }

  handleEvaluations() {
    return schedule.scheduleJob('*/1 * * * *', async () => {
      await this.handlePendingEvaluations();
    });
  }

  async scheduleSendingPhrases() {
    const activeUsers = await this.userRepository.findAll({
      where: { profileCompleted: true }
    });

    await Promise.all(
      activeUsers.map(async (user) => {
        const [hours, minutes] = user.messageSchedule.split(':');
        let date = new Date(new Date().setHours(hours, minutes, 0));

        if ((new Date().getTime() - 60) > date.getTime()) {
          date.setDate(date.getDate() + 1)
        }

        const schedule = await this.scheduleRepository.findOne({
          where: {
            userId: user.id,
            success: false,
          },
        });

        if (schedule) {
          if (moment(schedule.fireDateTime).toString() === moment(date).toString()) {
            return;
          } else {
            await this.scheduleRepository.destroy(schedule.id);
          }
        }

        const phrase = await this.phraseService.getPhraseToUser(user.id);

        await this.scheduleRepository.create({
          userId: user.id,
          phraseId: phrase.id,
          fireDateTime: date,
        });
      })
    );
  }

  async verifySchedules() {
    const schedules = await this.scheduleRepository.findAll({
      where: {
        success: false,
        fireDateTime: new Date(),
      },
    });

    await Promise.all(
      schedules.map(async schedule => {
        await this.twilioService.generateMessageWithPhrase(schedule.id);
      })
    );
  }

  async handlePendingEvaluations() {
    const minutesToChange = 2;
    const pendingEvaluations = await this.userRepository.findAll({
      where: { status: 'EVALUATION_WAITING' }
    });

    await Promise.all(
      pendingEvaluations.map(async (user) => {
        const diff = Math.abs(new Date(user.updatedAt) - new Date()) / 36e5;

        if (diff > minutesToChange / 60) {
          await this.twilioService.handleSendingEvaluations(user);
        }
      })
    )
  }

  setUsersToStandBy() {
    return schedule.scheduleJob('*/1 * * * *', async () => {
      const minutesToChange = 30;
      const usersToUpdate = await this.userRepository.findAll({
        where: { status: { [Op.notIn]: ['STAND_BY', 'REGISTER', 'EVALUATION_WAITING'] } }
      });

      await Promise.all(
        usersToUpdate.map(async (user) => {
          const lastMessage = await this.messageService.getLastMessageSent(user.id);
          const diff = Math.abs(new Date(lastMessage.createdAt) - new Date()) / 36e5;
          // 36e5 is the scientific notation for 60*60*1000, dividing by which converts
          // the milliseconds difference into hours.

          if (diff > minutesToChange / 60) {
            if (user.status === 'EVALUATION') {
              const evaluation = await this.evaluationRepository.findOne({
                where: {
                  userId: user.id,
                  status: 'PENDING',
                }
              });

              await this.evaluationRepository.update(evaluation.id, {
                status: 'EXPIRED',
              });
            }

            await this.userService.updateStatus(user.id, 'STAND_BY');
          }
        })
      );
    });
  }

}

module.exports = Tasks;
