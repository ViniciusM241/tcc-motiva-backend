const e = require('express');
const puppeteer = require('puppeteer');
const sequelize = require('sequelize');
const { Op } = require('sequelize');

class PensadorService {
  constructor({
    phraseRepository,
  }) {
    this.phraseRepository = phraseRepository;
  }

  async show(filters) {
    const quotes = await this._getQuotes(filters);

    return quotes;
  }

  async _getQuotes({
    term='positivos',
    pageIndex,
    max=5,
  }) {
    const handledTerm = `frases_de_${term.replace(' ', '_')}`;
    const handledPage = pageIndex > 0 ? `/${pageIndex}` : '';
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`https://www.pensador.com/${handledTerm}${handledPage}`);

    const response = await page.evaluate(() => {
      const boxes = [...document.querySelectorAll('.thought-card')];
      const title = document.querySelector('.title');
      const description = document.querySelector('.description');
      const countStr = description ? description.innerText : title.innerText;
      const count = countStr?.replace(/\D/g, '');

      const phrases = boxes.reduce((acc, cur) => {
        const texts = cur.querySelector('.autor').innerText?.split('\n');

        return [
          ...acc,
          {
            text: cur.querySelector('.frase').innerText,
            author: texts?.length ? texts[0] : 'Não reconhecido',
          },
        ];
      }, []);

      return {
        phrases,
        count,
        hasMore: true,
      };
    });

    await browser.close();

    const filteredPhrases = [];

    await Promise.all(
      response.phrases.map(async (phrase) => {
        const dbPhrase = await this.phraseRepository.findOne({
          where: {
            [Op.and]: [
              sequelize.literal("phrases.text = '" + phrase.text + "' COLLATE utf8mb4_unicode_ci")
            ],
          },
        });

        if (!dbPhrase) filteredPhrases.push(phrase);
      })
    );

    return {
      phrases: filteredPhrases,
      total: response.count || '0',
      hasMore: response.hasMore,
    };
  }
}

module.exports.default = PensadorService;
