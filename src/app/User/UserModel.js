const Model = require('../../bootstrap/Model');

class User extends Model {
  tableName = 'users';

  dataTypes = () => ({
    name: this.DataTypes.STRING,
    phoneNumber: this.DataTypes.STRING,
    messageSchedule: this.DataTypes.STRING,
    profileCompleted: {
      type: this.DataTypes.BOOLEAN,
      defaultValue: false,
    },
    status: {
      type: this.DataTypes.STRING,
      defaultValue: 'REGISTER',
      allowNull: false,
    },
  });

  relationships = () => [
    {
      model: 'Schedule',
      relation: 'hasMany',
      as: 'schedules',
      foreignKey: 'userId',
    },
  ];

}

module.exports.default = User;
