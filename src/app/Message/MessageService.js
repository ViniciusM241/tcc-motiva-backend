class MessageService {
  constructor({
    messageRepository,

    Sequelize,
  }) {
    this.messageRepository = messageRepository;

    this.sequelize = Sequelize;
  }

  async registerOutgoingMessage(message, userId) {
    await this.messageRepository.create({
      userId,
      text: message,
      type: 'OUTGOING',
    });
  }

  async registerIncomingMessage(message, userId) {
    await this.messageRepository.create({
      userId,
      text: message,
      type: 'INCOMING',
      success: true,
    });
  }

  async getLastMessageSent(userId) {
    const lastId = await this.messageRepository.findOne({
      attributes: [
        [this.sequelize.fn('MAX', this.sequelize.col('id')), 'id']
      ],
      where: {
        userId,
        type: 'OUTGOING',
      },
      raw: true,
    });

    const lastRegister = await this.messageRepository.findOne({
      where: {
        id: lastId.id,
      },
    });

    return lastRegister;
  }

  async getLastMessageReceived(userId) {
    const lastId = await this.messageRepository.findOne({
      attributes: [
        [this.sequelize.fn('MAX', this.sequelize.col('id')), 'id']
      ],
      where: {
        userId,
        type: 'INCOMING',
      },
      raw: true,
    });

    const lastRegister = await this.messageRepository.findOne({
      where: {
        id: lastId.id,
      },
    });

    return lastRegister;
  }

}

module.exports.default = MessageService;
