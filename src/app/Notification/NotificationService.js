class NotificationService {
  constructor({
    notificationMessageModel,
    notificationRepository,
    notificationMessageRepository,
    adminRepository,

    Error,
  }) {
    this.notificationMessageModel = notificationMessageModel.sequelize();
    this.notificationRepository = notificationRepository;
    this.notificationMessageRepository = notificationMessageRepository;
    this.adminRepository = adminRepository;

    this.error = Error;
  }

  async showByAdminId(id) {
    const notifications = await this.notificationRepository.findAll({
      where: {
        adminId: id,
      },
      include: {
        model: this.notificationMessageModel,
        as: 'notificationMessage',
      },
      order: [['viewed', 'desc']],
    });

    return notifications;
  }

  async viewNotification(adminId, notificationId) {
    const notifications = await this.notificationRepository.findOne({
      where: {
        adminId,
        id: notificationId,
      },
    });

    if (!notifications) throw new this.error("Notification not found", 400);

    await this.notificationRepository.update(notificationId, {
      viewed: true,
      viewedDate: new Date(),
    });
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
