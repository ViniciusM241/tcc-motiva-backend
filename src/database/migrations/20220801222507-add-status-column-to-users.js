'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'users',
      'status',
      {
        type: Sequelize.STRING,
        default: 'REGISTER',
        allowNull: false,
        after: 'profileCompleted',
      }
    );
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn(
      'users',
      'status'
    );
  }
};
