class NotificationRepository {
  constructor({
    notificationModel,
  }) {
    this.notificationModel = notificationModel.sequelize();
  }

  findById(id) {
    return this.notificationModel.findByPk(id);
  }

  findOne(opts) {
    return this.notificationModel.findOne(opts);
  }

  findAll(opts) {
    return this.notificationModel.findAll(opts);
  }

  create(data) {
    return this.notificationModel.create(data);
  }

  update(id, data) {
    return this.notificationModel.update(data, {
      where: {
        id,
      },
    });
  }

}

module.exports.default = NotificationRepository;
