'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      Payment.belongsTo(models.Patient, {
        foreignKey: 'patientId',
        as: 'patient'
      });
      Payment.belongsTo(models.Appointment, {
        foreignKey: 'appointmentId',
        as: 'appointment'
      });
    }
  }
  
  Payment.init({
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    appointmentId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    doctorName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'card'
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed'),
      defaultValue: 'pending'
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    payerEmail: {
      type: DataTypes.STRING,
      allowNull: true
    },
    payerName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    paypalOrderId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    transactionDetails: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    upiId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Payment',
    tableName: 'payments'
  });
  
  return Payment;
};