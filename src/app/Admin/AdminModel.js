const Model = require('../../bootstrap/Model');
const NotificationModel = require('../Notification/NotificationModel').default;

class Admin extends Model {
  tableName = 'admins';

  dataTypes = () => ({
    name: this.DataTypes.STRING,
    email: this.DataTypes.STRING,
    authToken: this.DataTypes.STRING,
    lastLogin: this.DataTypes.DATE,
  });

  relationships = () => [
    {
      model: 'notification',
      as: 'notification',
      relation: 'belongsToMany',
      foreignKey: 'adminId',
      otherKey: 'id',
      through: new NotificationModel().sequelize(),
    },
  ];
}

module.exports.default = Admin;
