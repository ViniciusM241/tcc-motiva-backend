const { hash } = require("bcryptjs");

class AdminService {
  constructor({
    adminRepository,
    notificationService,
    notificationModel,
    notificationMessageModel,
  }) {
    this.adminRepository = adminRepository;
    this.notificationService = notificationService;
    this.notificationModel = notificationModel.sequelize();
    this.notificationMessageModel = notificationMessageModel.sequelize();
  }

  async show() {
    const admins = await this.adminRepository.findAll();

    return admins;
  }

  async profile(id) {
    const profile = await this.adminRepository.findById(id, {
      attributes: ['id', 'name', 'email', 'lastLogin'],
      include: [
        {
          model: this.notificationModel,
          as: 'notification',
          include: {
            model: this.notificationMessageModel,
            as: 'notificationMessage',
          },
        },
      ],
    });

    return profile;
  }

  async findByEmail(email) {
    const admin = await this.adminRepository.findOne({
      where: {
        email: email,
      },
    });

    return admin;
  }

  async create(data) {
    const hashPassword = await hash(data.password, 8);
    data.authToken = hashPassword;

    const admin = await this.adminRepository.create(data);

    return admin;
  }

  async updateLastLogin(id) {
    await this.adminRepository.update(id, {
      lastLogin: new Date(),
    });
  }

  async notificationsByAdminId(adminId) {
    const notifications = await this.notificationService.showByAdminId(adminId);

    return notifications;
  }
}

module.exports.default = AdminService;
