class NotificationMessageController {
  constructor({
    notificationMessageService,
  }) {
    this.notificationMessageService = notificationMessageService;
  }

  async show(req, res) {

  }

  async create(req, res) {
    const body = req.body();

    const notificationMessage = await this.notificationMessageService.create(body);

    return res.dataResponse(notificationMessage);
  }
}

module.exports.default = NotificationMessageController;
