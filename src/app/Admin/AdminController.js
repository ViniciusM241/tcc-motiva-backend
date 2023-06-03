class AdminController {
  constructor({
    adminService,
    notificationService,
  }) {
    this.adminService = adminService;
    this.notificationService = notificationService;
  }

  async search(req, res) {
    const query = req.query();
    const admins = await this.adminService.search(query);

    return res.dataResponse(admins);
  }

  async getById(req, res) {
    const { id } = req.params();
    const admin = await this.adminService.getById(id);

    return res.dataResponse(admin);
  }

  async update(req, res) {
    const { id } = req.params();
    const body = req.body();
    await this.adminService.updateById(id, body);

    return res.end();
  }

  async delete(req, res) {
    const { id } = req.params();

    await this.adminService.deleteById(id);

    return res.end();
  }

  async profile(req, res) {
    const id = req.getUser().id;
    const profile = await this.adminService.profile(id);

    return res.dataResponse(profile);
  }

  async create(req, res) {
    const body = req.body();

    const admin = await this.adminService.create(body);

    res.status(201);
    return res.dataResponse(admin);
  }

  async showNotifications(req, res) {
    const adminId = req.params().id;
    const notifications = await this.adminService.notificationsByAdminId(adminId);

    return res.dataResponse(notifications);
  }

  async viewNotification(req, res) {
    const { id, notificationId } = req.params();

    await this.notificationService.viewNotification(id, notificationId);

    return res.end();
  }
}

module.exports.default = AdminController;
