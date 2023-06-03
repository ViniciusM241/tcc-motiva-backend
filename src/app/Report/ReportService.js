const moment = require('moment');
const { Op } = require('sequelize');
const sequelize = require('sequelize');

class ReportService {
  constructor({
    phraseModel,
    userRepository,
    evaluationRepository,
    phraseRepository,

    Error,
  }) {
    this.phraseModel = phraseModel.sequelize();
    this.userRepository = userRepository;
    this.evaluationRepository = evaluationRepository;
    this.phraseRepository = phraseRepository;

    this.error = Error;
  }

  async show({
    month=moment().month() + 1,
    year=moment().year(),
  }) {
    const totalActiveUsers = await this._getTotalUsers();
    const newUsers = await this._getNewUsers({ month, year });
    const newEvaluations = await this._getNewEvaluations({ month, year });
    const evaluationsAvarage = await this._getEvaluationsAvarage({ month, year });
    const phrasesRanking = await this._getPhrasesRanking({ month, year });

    return {
      totalActiveUsers,
      newUsers,
      newEvaluations,
      evaluationsAvarage,
      phrasesRanking,
    };
  }

  async _getTotalUsers() {
    return await this.userRepository.count({
      where: {
        profileCompleted: true,
      },
    });
  }

  async _getNewUsers({ month, year }) {
    return await this.userRepository.count({
      where: {
        profileCompleted: true,
        [Op.and]: [
          sequelize.where(sequelize.fn("month", sequelize.col("createdAt")), month),
          sequelize.where(sequelize.fn("year", sequelize.col("createdAt")), year)
        ],
      },
    });
  }

  async _getNewEvaluations({ month, year }) {
    return await this.evaluationRepository.count({
      where: {
        status: 'EVALUATED',
        [Op.and]: [
          sequelize.where(sequelize.fn("month", sequelize.col("createdAt")), month),
          sequelize.where(sequelize.fn("year", sequelize.col("createdAt")), year)
        ],
      },
    });
  }

  async _getEvaluationsAvarage({ month, year }) {
    const evaluations = await this.evaluationRepository.findAll({
      attributes: ['grade'],
      where: {
        status: 'EVALUATED',
        [Op.and]: [
          sequelize.where(sequelize.fn("month", sequelize.col("createdAt")), month),
          sequelize.where(sequelize.fn("year", sequelize.col("createdAt")), year)
        ],
      },
    });

    const grades = evaluations.map(x => x.grade);
    const sum = grades.reduce((acc, cur) => {
      return acc + cur;
    }, 0);
    const avg = sum / grades.length;

    return avg.toFixed(2);
  }

  async _getPhrasesRanking({ month, year }) {
    const evaluations = await this.evaluationRepository.findAll({
      attributes: ['grade'],
      where: {
        status: 'EVALUATED',
        [Op.and]: [
          sequelize.where(sequelize.fn("month", sequelize.col("evaluations.createdAt")), month),
          sequelize.where(sequelize.fn("year", sequelize.col("evaluations.createdAt")), year)
        ],
      },
      include: [
        {
          attributes: ['text', 'author'],
          model: this.phraseModel,
          as: 'phrase',
          where: {
            disabledAt: null,
          },
        },
      ],
      order: [['grade', 'desc']],
      limit: 4,
    });

    return evaluations;
  }
}

module.exports.default = ReportService;
