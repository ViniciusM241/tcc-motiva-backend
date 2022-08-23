class NotificationController {
  constructor({
    notificationService,
  }) {
    this.notificationService = notificationService;
  }

  async show(req, res) {

  }

  async create(req, res) {
    const body = req.body();

    const notification = await this.notificationService.create(body);

    return res.dataResponse(notification);
  }
}

module.exports.default = NotificationController;
