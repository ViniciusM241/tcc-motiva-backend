class AuthController {
  constructor({
    authService,
  }) {
    this.authService = authService;
  }
  
  async login(req, res) {
    const body = req.body();
    
    const data = await this.authService.login(body);

    res.dataResponse(data);
  }

}

module.exports.default = AuthController;
