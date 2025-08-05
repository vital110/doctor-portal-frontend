'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ClinicSetting extends Model {
    static associate(models) {
      // define association here
    }
  }
  
  ClinicSetting.init({
    settingKey: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    settingValue: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'ClinicSetting',
    tableName: 'clinic_settings'
  });
  
  return ClinicSetting;
};