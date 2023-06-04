const { Op } = require("sequelize");

class PhraseService {
  constructor({
    phraseRepository,
    scheduleRepository,
    notificationRepository,
    notificationMessageRepository,
    adminRepository,
    evaluationService,

    Error,
  }) {
    this.phraseRepository = phraseRepository;
    this.scheduleRepository = scheduleRepository;
    this.notificationRepository = notificationRepository;
    this.notificationMessageRepository = notificationMessageRepository;
    this.adminRepository = adminRepository;
    this.evaluationService = evaluationService;

    this.error = Error;
  }

  async show() {
    const phrases = await this.phraseRepository.findAll({
      where: {
        disabledAt: null,
      },
    });

    const filteredPhrases = Promise.all(
      phrases.map(async phrase => {
        const avg = await this.evaluationService.evaluationAvgByPhrase(phrase.id);
        return {
          ...phrase.dataValues,
          avg,
        };
      })
    );

    return filteredPhrases;
  }

  async getById(id) {
    const phrase = await this.phraseRepository.findOne({
      where: {
        id,
        disabledAt: null,
      },
    });

    return phrase;
  }

  async update(id, data) {
    const currentPhrase = await this.phraseRepository.findOne({
      where: {
        id,
        disabledAt: null,
      },
    });

    if (!currentPhrase) {
      throw new this.error('Phrase not found', 400);
    }

    const phraseAlreadyExists = await this.phraseRepository.findOne({
      where: {
        text: data.text,
        disabledAt: null,
        [Op.not]: {
          id,
        },
      },
    });

    if (phraseAlreadyExists) throw new this.error('Phrase already exists', 400);

    await this.phraseRepository.update(id, data);
  }

  async search({
    limit=15,
    offset=0,
    order,
    sort,
  }) {
    const phrases = await this.phraseRepository.findAll({
      offset: parseInt(offset),
      limit: parseInt(limit) || undefined,
      order: [[ sort || 'createdAt', order || 'ASC' ]],
      where: {
        disabledAt: null,
      },
    });

    const filteredPhrases = Promise.all(
      phrases.map(async phrase => {
        const avg = await this.evaluationService.evaluationAvgByPhrase(phrase.id);
        return {
          ...phrase.dataValues,
          avg,
        };
      })
    );

    return filteredPhrases;
  }

  async create(data) {
    const phraseAlreadyExists = await this.phraseRepository.findOne({
      where: {
        text: data.text,
        disabledAt: null,
      },
    });

    if (phraseAlreadyExists) throw new this.error('Phrase already exists', 400);

    const phrase = await this.phraseRepository.create(data);

    return phrase;
  }

  async delete(id) {
    const phrase = await this.phraseRepository.findOne({
      where: {
        id,
        disabledAt: null,
      },
    });

    if (!phrase) {
      throw new this.error('Phrase not found', 400);
    }

    await this.phraseRepository.update(id, {
      disabledAt: new Date(),
    });
  }

  async getPhraseToUser(userId) {
    const phrases = await this.phraseRepository.findAll({
      attributes: ['id'],
      where: {
        disabledAt: null,
      },
    });
    const phrasesAlreadySent = await this.scheduleRepository.findAll({
      attributes: ['phraseId'],
      where: {
        userId,
      },
      raw: true,
    });

    const phrasesAlreadySentId = phrasesAlreadySent.reduce((acc, cur) => {
      if (!acc.includes(cur.phraseId)) return [...acc, cur.phraseId];
      return acc;
    }, []);

    const filteredPhrases = phrases.filter(x => !phrasesAlreadySentId.includes(x.id));

    if (!filteredPhrases.length) {
      const title = 'Cadastro de frases';
      const html = 'As frases disponíveis estão acabando. Cadastre mais';

      let notificationMessage = await this.notificationMessageRepository.findOne({
        where: {
          title,
          html,
        },
      });

      if (!notificationMessage) {
        notificationMessage = await this.notificationMessageRepository.create({
          title,
          html,
        });
      }

      const admins = await this.adminRepository.findAll();

      Promise.all(
        admins.map(async admin => {
          await this.notificationRepository.create({
            adminId: admin.id,
            notificationMessageId: notificationMessage.id,
          });
        })
      );

      return await this.phraseRepository.findOne();
    }

    const id = Math.ceil(Math.random() * filteredPhrases.length - 1);

    const phrase = await this.phraseRepository.findOne({
      where: {
        id: filteredPhrases[id].id,
      }
    });

    return phrase;
  }

}

module.exports.default = PhraseService;
