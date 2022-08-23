const { asValue } = require('awilix');
const messages = require('./messages');

module.exports = (container) => {
  container.register({
    messages: asValue(messages),
  });
}
