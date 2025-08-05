'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DoctorLeave extends Model {
    static associate(models) {
      // define association here
    }
  }
  
  DoctorLeave.init({
    doctorName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    leaveDate: {
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
    modelName: 'DoctorLeave',
    tableName: 'doctor_leaves'
  });
  
  return DoctorLeave;
};