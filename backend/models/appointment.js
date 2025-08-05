'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    static associate(models) {
      // define association here
    }
  }

  Appointment.init({
    date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Appointment',
  });

  return Appointment;
};