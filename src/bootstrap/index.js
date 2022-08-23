const { asValue } = require('awilix');
const Error = require('./Error');
const Sequelize = require('./Sequelize');

module.exports = (container) => {
  container.register({
    Error: asValue(Error),
    Sequelize: asValue(Sequelize),
  });
}
