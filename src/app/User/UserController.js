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

  async search(req, res) {
    const query = req.query();

    const users = await this.userService.search(query);

    return res.dataResponse(users);
  }

  async chat(req, res) {
    const id = req.params().id;

    const chat = await this.userService.getChatByUserId(id);

    return res.dataResponse(chat);
  }
}

module.exports.default = UserController;
