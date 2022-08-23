class PhraseRepository {
  constructor({
    phraseModel,
  }) {
    this.phraseModel = phraseModel.sequelize();
  }

  findById(id) {
    return this.phraseModel.findByPk(id);
  }

  findOne(opts) {
    return this.phraseModel.findOne(opts);
  }

  findAll(opts) {
    return this.phraseModel.findAll(opts);
  }

  create(data) {
    return this.phraseModel.create(data);
  }

  update(id, data) {
    return this.phraseModel.update(data, {
      where: {
        id,
      },
    });
  }

}

module.exports.default = PhraseRepository;
