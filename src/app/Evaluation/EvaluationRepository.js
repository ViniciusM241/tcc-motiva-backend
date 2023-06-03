class EvaluationRepository {
  constructor({
    evaluationModel,
  }) {
    this.evaluationModel = evaluationModel.sequelize();
  }

  count(opts) {
    return this.evaluationModel.count(opts);
  }

  findById(id, opts) {
    return this.evaluationModel.findByPk(id, opts);
  }

  findOne(opts) {
    return this.evaluationModel.findOne(opts);
  }

  findAll(opts) {
    return this.evaluationModel.findAll(opts);
  }

  create(data) {
    return this.evaluationModel.create(data);
  }

  update(id, data) {
    return this.evaluationModel.update(data, {
      where: {
        id,
      },
    });
  }

  destroy(id) {
    return this.evaluationModel.destroy({
      where: {
        id,
      },
    });
  }

}

module.exports.default = EvaluationRepository;
