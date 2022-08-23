class ScheduleRepository {
  constructor({
    scheduleModel,
  }) {
    this.scheduleModel = scheduleModel.sequelize();
  }

  findById(id, opts) {
    return this.scheduleModel.findByPk(id, opts);
  }

  findOne(opts) {
    return this.scheduleModel.findOne(opts);
  }

  findAll(opts) {
    return this.scheduleModel.findAll(opts);
  }

  create(data) {
    return this.scheduleModel.create(data);
  }

  update(id, data) {
    return this.scheduleModel.update(data, {
      where: {
        id,
      },
    });
  }

  destroy(id) {
    return this.scheduleModel.destroy({
      where: {
        id,
      },
    });
  }

}

module.exports.default = ScheduleRepository;
