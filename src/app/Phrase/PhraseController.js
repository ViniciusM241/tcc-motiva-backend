class PhraseController {
  constructor({
    phraseService,
  }) {
    this.phraseService = phraseService;
  }

  async show(req, res) {
    const phrases = await this.phraseService.show();

    return res.dataResponse(phrases);
  }

  async create(req, res) {
    const body = req.body();

    const phrase = await this.phraseService.create(body);

    return res.dataResponse(phrase);
  }
}

module.exports.default = PhraseController;
