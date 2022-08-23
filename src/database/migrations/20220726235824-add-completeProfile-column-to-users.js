'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'users',
      'profileCompleted',
      {
        type: Sequelize.BOOLEAN,
        default: false,
        allowNull: false,
        after: 'messageSchedule',
      }
    );
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn(
      'users',
      'profileCompleted'
    );
  }
};
