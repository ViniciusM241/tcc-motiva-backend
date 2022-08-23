class NotificationService {
  constructor({
    notificationRepository,
    notificationMessageRepository,
    adminRepository,

    Error,
  }) {
    this.notificationRepository = notificationRepository;
    this.notificationMessageRepository = notificationMessageRepository;
    this.adminRepository = adminRepository;

    this.error = Error;
  }

  async show() {

  }

  async showByAdminId(id) {
    console.log(id)
    const notifications = await this.notificationRepository.findAll({
      where: {
        adminId: id,
      },
    });

    return notifications;
  }

  async create(data) {
    const notificationMessage = await this.notificationMessageRepository.findById(data.notificationMessageId);
    const admin = await this.adminRepository.findById(data.adminId);

    if (!notificationMessage) throw new this.error('NotificationMessage not found', 400);
    if (!admin) throw new this.error('Admin not found', 400);

    const notification = await this.notificationRepository.create(data);

    return notification;
  }
}

module.exports.default = NotificationService;
