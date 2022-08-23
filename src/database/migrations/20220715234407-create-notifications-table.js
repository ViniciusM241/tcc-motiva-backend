'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('notifications', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      viewed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        default: false,
      },
      viewedDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      adminId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      notificationMessageId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('notifications');
  }
};
