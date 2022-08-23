const sequelize = require('./Sequelize');

class Model {
  get DataTypes() {
    return sequelize.DataTypes;
  }

  options() {
    return {
      freezeTableName: true,
      timestamps: true,
      paranoid: true,
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
    }
  }

  sequelize() {
    try {
      if (sequelize.getModel(this.tableName)) {
        return sequelize.getModel(this.tableName)
      }

      const model = sequelize.initModel(
        this.tableName,
        {
          // It's key to specify this id in order to belongsToMany relationships work
          id: {
            type: this.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          ...this.dataTypes(),
        },
        this.options()
      )

      /**
       * Remove createdAt, updatedAt, deletedAt and revisions attributes
       * from every find return
       */
      model.addScope('defaultScope', {
        attributes: { exclude: ['deletedAt', 'revision'] },
      })

      const relationships = typeof this.relationships === 'function' ? this.relationships() : []

      relationships.forEach((element) => {
        const path = element.relativePath
          ? `${element.relativePath}/${element.model}Model`
          : `${element.model}/${element.model}Model`

        const relatedModel = new (require(`../app/${path}`).default)()

        model[element.relation](relatedModel.sequelize(), {
          ...this.mapAttributes(element),
        })
      })

      return model
    } catch (e) {
      throw new Error(e)
    }
  }

  mapAttributes = (element) => {
    const ignoredAttributes = ['model', 'relation']

    return Object.keys(element).reduce((carry, attribute) => {
      if (ignoredAttributes.includes(attribute)) {
        return carry
      }

      return {
        ...carry,
        [attribute]: element[attribute],
      }
    }, {})
  }
}

module.exports = Model;
