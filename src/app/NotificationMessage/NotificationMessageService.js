
class NotificationMessageService {
  constructor({
    notificationMessageRepository,
  }) {
    this.notificationMessageRepository = notificationMessageRepository;
  }

  async show() {

  }

  async create(data) {
    const notification = await this.notificationMessageRepository.create(data);

    return notification;
  }

}

module.exports.default = NotificationMessageService;
