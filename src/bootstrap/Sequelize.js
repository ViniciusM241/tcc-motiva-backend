const Sequelize = require('sequelize');
const { DataTypes } = require('sequelize');
const dbConfig = require('../config/database');

class BaseSequelize extends Sequelize {
  constructor() {
    super(dbConfig);

    this.modelInstances = {};
  }

  get DataTypes() {
    return DataTypes;
  }

  initModel(tableName, dataTypes = {}, options = {}) {
    if (!this.modelInstances[tableName]) {
      this.modelInstances[tableName] = this.define(tableName, dataTypes, options);
    }

    return this.modelInstances[tableName];
  }

  getModel(tableName) {
    return this.modelInstances[tableName];
  }
}

module.exports = new BaseSequelize();
