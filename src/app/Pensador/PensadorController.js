class PensadorController {
  constructor({
    pensadorService,
  }) {
    this.pensadorService = pensadorService;
  }

  async show(req, res) {
    const filters = req.query();
    const quotes = await this.pensadorService.show(filters);

    return res.dataResponse(quotes);
  }
}

module.exports.default = PensadorController;
