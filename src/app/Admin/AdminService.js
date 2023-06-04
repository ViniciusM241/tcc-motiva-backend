const { hash } = require("bcryptjs");

class AdminService {
  constructor({
    adminRepository,
    notificationService,
    notificationModel,
    notificationMessageModel,
    Error,
  }) {
    this.adminRepository = adminRepository;
    this.notificationService = notificationService;
    this.notificationModel = notificationModel.sequelize();
    this.notificationMessageModel = notificationMessageModel.sequelize();

    this.error = Error;
  }

  async search({
    limit=15,
    page=0,
    order,
    sort,
  }) {
    const admins = await this.adminRepository.findAll({
      offset: parseInt(page) * parseInt(limit),
      limit: parseInt(limit) || undefined,
      order: [[ sort || 'createdAt', order || 'ASC' ]],
      raw: true,
    });

    const count = await this.adminRepository.count();

    return {
      admins,
      count,
    };
  }

  async getById(id) {
    const admin = await this.adminRepository.findById(id);

    admin.authToken = admin.authToken.substring(0, 8);

    return admin;
  }

  async updateById(id, data) {
    const currentAdmin = await this.getById(id);

    if (!currentAdmin) {
      throw new this.error('Admin not found', 400);
    }

    if (data.password) {
      if (currentAdmin.authToken?.substring(0, 8) !== data.password) {
        const hashPassword = await hash(data.password, 8);
        data.authToken = hashPassword;
      }
    }

    await this.adminRepository.update(id, data);
  }

  async deleteById(id) {
    const admin = await this.getById(id);

    if (!admin) return;

    await this.adminRepository.destroy(id);
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
      order: [['notification', 'viewed', 'ASC'], ['notification', 'createdAt', 'DESC']],
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
