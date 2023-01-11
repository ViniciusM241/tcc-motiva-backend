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

  async search(req, res) {
    const query = req.query();
    const phrases = await this.phraseService.search(query);

    return res.dataResponse(phrases);
  }

  async create(req, res) {
    const body = req.body();

    const phrase = await this.phraseService.create(body);

    return res.dataResponse(phrase);
  }

  async delete(req, res) {
    const id = req.params().id;

    await this.phraseService.delete(id);

    res.status(204);

    return res.end();
  }
}

module.exports.default = PhraseController;
