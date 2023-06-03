const Model = require("../../bootstrap/Model");

class EvaluationModel extends Model {
  tableName = 'evaluations';

  dataTypes = () => ({
    phraseId: this.DataTypes.INTEGER,
    status: this.DataTypes.STRING,
    userId: {
      type: this.DataTypes.INTEGER,
      onDelete: 'CASCADE',
    },
    grade: this.DataTypes.INTEGER,
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
      as: 'phrase',
      foreignKey: 'phraseId',
    },
  ];
}

module.exports.default = EvaluationModel;
