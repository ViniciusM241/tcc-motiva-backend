class AdminController {
  constructor({
    adminService,
  }) {
    this.adminService = adminService;
  }

  async show(req, res) {
    const admins = await this.adminService.show();

    return res.dataResponse(admins);
  }

  async profile(req, res) {
    const id = req.getUser().id;
    const profile = await this.adminService.profile(id);

    return res.dataResponse(profile);
  }

  async create(req, res) {
    const body = req.body();

    const admin = await this.adminService.create(body);

    return res.dataResponse(admin);
  }

  async showNotifications(req, res) {
    const adminId = req.params().id;
    const notifications = await this.adminService.notificationsByAdminId(adminId);

    return res.dataResponse(notifications);
  }
}

module.exports.default = AdminController;
