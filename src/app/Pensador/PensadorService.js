const e = require('express');
const puppeteer = require('puppeteer');

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

    const phrases = await page.evaluate(() => {
      const boxes = [...document.querySelectorAll('.thought-card')];

      return boxes.reduce((acc, cur) => {
        return [
          ...acc,
          {
            text: cur.querySelector('.frase').innerText,
            author: cur.querySelector('.autor').innerText,
          },
        ];
      }, []);
    });

    await browser.close();

    const filteredPhrases = [];

    await Promise.all(
      phrases.map(async (phrase) => {
        const dbPhrase = await this.phraseRepository.findOne({
          where: {
            text: phrase.text,
          },
        });

        if (!dbPhrase) filteredPhrases.push(phrase);
      })
    );

    return filteredPhrases;
  }
}

module.exports.default = PensadorService;
