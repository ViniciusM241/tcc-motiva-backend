const Model = require("../../bootstrap/Model");

class MessageModel extends Model {
  tableName = 'messages';

  dataTypes = () => ({
    type: this.DataTypes.ENUM('OUTGOING', 'INCOMING'),
    text: this.DataTypes.TEXT('long'),
    userId: this.DataTypes.INTEGER,
    success: {
      type: this.DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  relationships = () => [

  ];
}

module.exports.default = MessageModel;
