'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'phrases',
      'disabledAt',
      {
        type: Sequelize.DATE,
        default: null,
        after: 'updatedAt',
      }
    );
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn(
      'phrases',
      'disabledAt'
    );
  }
};
