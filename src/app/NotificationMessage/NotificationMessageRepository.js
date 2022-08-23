class NotificationMessageRepository {
  constructor({
    notificationMessageModel,
  }) {
    this.notificationMessageModel = notificationMessageModel.sequelize();
  }

  findById(id) {
    return this.notificationMessageModel.findByPk(id);
  }

  findOne(opts) {
    return this.notificationMessageModel.findOne(opts);
  }

  create(data) {
    return this.notificationMessageModel.create(data);
  }

  update(id, data) {
    return this.notificationMessageModel.update(data, {
      where: {
        id,
      },
    });
  }

}

module.exports.default = NotificationMessageRepository;
