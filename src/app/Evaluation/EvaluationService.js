class EvaluationService {
  constructor({
    evaluationRepository,

    Sequelize,
  }) {
    this.evaluationRepository = evaluationRepository;

    this.sequelize = Sequelize;
  }

}

module.exports.default = EvaluationService;
