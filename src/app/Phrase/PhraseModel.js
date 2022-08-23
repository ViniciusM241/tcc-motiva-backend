const Model = require('../../bootstrap/Model');

class PhraseModel extends Model {
  tableName = 'phrases';

  dataTypes = () => ({
    text: this.DataTypes.TEXT('long'),
    author: this.DataTypes.STRING(100),
  });

  relationships = () => [
    {
      model: 'schedule',
      relation: 'hasMany',
      as: 'schedules',
      foreignKey: 'phraseId',
    },
  ];
}

module.exports.default = PhraseModel;
