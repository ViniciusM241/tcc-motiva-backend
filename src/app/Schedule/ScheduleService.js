class ScheduleService {
  constructor({
    scheduleRepository,

    Sequelize,
  }) {
    this.scheduleRepository = scheduleRepository;

    this.sequelize = Sequelize;
  }

  async lastSchedule(userId) {
    const lastId = await this.scheduleRepository.findOne({
      attributes: [
        [this.sequelize.fn('MAX', this.sequelize.col('id')), 'id']
      ],
      where: {
        userId,
        success: true,
      },
      raw: true,
    });

    const lastRegister = await this.scheduleRepository.findOne({
      where: {
        id: lastId.id,
      },
    });

    return lastRegister;
  }

}

module.exports.default = ScheduleService;
