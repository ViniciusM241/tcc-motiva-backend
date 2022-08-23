class UserController {
  constructor({
    userService,
  }) {
    this.userService = userService;
  }

  async show(req, res) {
    const users = await this.userService.show();
    return res.dataResponse(users);
  }

  async create(req, res) {
    const body = req.body;
    const user = await this.userService.create(body);
    return res.dataResponse(user);
  }
}

module.exports.default = UserController;
