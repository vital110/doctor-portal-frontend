'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    static associate(models) {
      // define association here
      Appointment.belongsTo(models.Patient, {
        foreignKey: 'patientId',
        as: 'patient'
      });
      Appointment.hasMany(models.Payment, {
        foreignKey: 'appointmentId',
        as: 'payments'
      });
    }
  }

  Appointment.init({
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'patients',
        key: 'id'
      }
    },
    doctorName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    appointmentDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    appointmentTime: {
      type: DataTypes.STRING,
      allowNull: false
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
      defaultValue: 'pending'
    }
  }, {
    sequelize,
    modelName: 'Appointment',
    tableName: 'appointments'
  });

  return Appointment;
};