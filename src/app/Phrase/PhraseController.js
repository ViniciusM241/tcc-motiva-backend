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

    res.status(201);
    return res.dataResponse(phrase);
  }

  async update(req, res) {
    const id = req.params().id;
    const body = req.body();

    await this.phraseService.update(id, body);

    return res.end();
  }

  async getById(req, res) {
    const id = req.params().id;
    const phrase = await this.phraseService.getById(id);

    if (!phrase) {
      res.status(404);
      return res.end();
    }

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
