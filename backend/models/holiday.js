'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Holiday extends Model {
    static associate(models) {
      // define association here
    }
  }

  Holiday.init({
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Holiday',
    tableName: 'holidays'
  });

  return Holiday;
};