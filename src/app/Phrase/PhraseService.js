const { Op } = require("sequelize");

class PhraseService {
  constructor({
    phraseRepository,
    scheduleRepository,

    Error,
  }) {
    this.phraseRepository = phraseRepository;
    this.scheduleRepository = scheduleRepository;

    this.error = Error;
  }

  async show() {
    const phrases = await this.phraseRepository.findAll();

    return phrases;
  }

  async create(data) {
    const phraseAlreadyExists = await this.phraseRepository.findOne({
      where: {
        text: data.text,
      },
    });

    if (phraseAlreadyExists) throw new this.error('Phrase already exists', 400);

    const phrase = await this.phraseRepository.create(data);

    return phrase;
  }

  async getPhraseToUser(userId) {
    const phrases = await this.phraseRepository.findAll({ attributes: ['id'] });
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
      // notify admins
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
