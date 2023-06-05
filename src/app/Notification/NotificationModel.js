const Model = require('../../bootstrap/Model');


class Notification extends Model {
  tableName = 'notifications';

  dataTypes = () => ({
    adminId: this.DataTypes.INTEGER,
    notificationMessageId: this.DataTypes.INTEGER,
    viewed: {
      type: this.DataTypes.BOOLEAN,
      defaultValue: false,
    },
    viewedDate: this.DataTypes.DATE,
  });

  relationships = () => [
    {
      model: 'NotificationMessage',
      relation: 'belongsTo',
      as: 'notificationMessage',
    },
  ];

}

module.exports.default = Notification;
