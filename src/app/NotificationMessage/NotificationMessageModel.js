const Model = require('../../bootstrap/Model');
const NotificationModel = require('../Notification/NotificationModel').default;

class NotificationMessage extends Model {
  tableName = 'notificationMessages';

  dataTypes = () => ({
    html: this.DataTypes.TEXT('long'),
    title: this.DataTypes.STRING(100),
    link: this.DataTypes.STRING(255),
  });

  relationships = () => [
    {
      model: 'Admin',
      relation: 'belongsToMany',
      as: 'admin',
      foreignKey: 'notificationMessageId',
      through: new NotificationModel().sequelize(),
    },
    {
      model: 'Notification',
      relation: 'hasMany',
      as: 'notification',
      foreignKey: 'notificationMessageId',
    },
  ];
}

module.exports.default = NotificationMessage;
