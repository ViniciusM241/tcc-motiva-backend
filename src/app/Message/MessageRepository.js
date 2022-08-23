class MessageRepository {
  constructor({
    messageModel,
  }) {
    this.messageModel = messageModel.sequelize();
  }

  findById(id) {
    return this.messageModel.findByPk(id);
  }

  findOne(opts) {
    return this.messageModel.findOne(opts);
  }

  findAll(opts) {
    return this.messageModel.findAll(opts);
  }

  create(data) {
    return this.messageModel.create(data);
  }

  update(id, data) {
    return this.messageModel.update(data, {
      where: {
        id,
      },
    });
  }

}

module.exports.default = MessageRepository;
