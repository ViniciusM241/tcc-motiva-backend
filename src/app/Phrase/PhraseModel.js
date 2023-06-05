const Model = require('../../bootstrap/Model');

class PhraseModel extends Model {
  tableName = 'phrases';

  dataTypes = () => ({
    text: this.DataTypes.TEXT('long'),
    author: this.DataTypes.STRING(100),
    disabledAt: {
      type: this.DataTypes.DATE,
      defaultValue: null,
    },
  });

  relationships = () => [
    {
      model: 'Schedule',
      relation: 'hasMany',
      as: 'schedules',
      foreignKey: 'phraseId',
    },
  ];
}

module.exports.default = PhraseModel;
