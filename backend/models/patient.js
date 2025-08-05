'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Patient extends Model {
    static associate(models) {
      // define association here
    }
  }

  Patient.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Patient',
  });

  return Patient;
};