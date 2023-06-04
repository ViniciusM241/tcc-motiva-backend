class EvaluationService {
  constructor({
    evaluationRepository,

    Sequelize,
  }) {
    this.evaluationRepository = evaluationRepository;

    this.sequelize = Sequelize;
  }

  async evaluationAvgByPhrase(phraseId) {
    const evaluations = await this.evaluationRepository.findAll({
      where: {
        phraseId,
        status: 'EVALUATED',
      },
      raw: true,
    });

    const total = evaluations.length || 0;
    const sum = evaluations.reduce((acc, cur) => {
      return acc + cur.grade;
    }, 0);
    const avg = sum / total;

    if (isNaN(avg)) {
      return 'Não avaliado';
    }

    return avg.toFixed(2);
  }

}

module.exports.default = EvaluationService;
