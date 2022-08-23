const Model = require("../../bootstrap/Model");

class ScheduleModel extends Model {
  tableName = 'schedules';

  dataTypes = () => ({
    fireDateTime: this.DataTypes.DATE,
    phraseId: this.DataTypes.INTEGER,
    userId: {
      type: this.DataTypes.INTEGER,
      onDelete: 'CASCADE',
    },
    success: {
      type: this.DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  relationships = () => [
    {
      model: 'user',
      relation: 'belongsTo',
      as: 'users',
      foreignKey: 'userId',
    },
    {
      model: 'phrase',
      relation: 'belongsTo',
      as: 'phrases',
      foreignKey: 'phraseId',
    },
  ];
}

module.exports.default = ScheduleModel;
