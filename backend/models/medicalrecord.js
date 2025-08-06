'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class MedicalRecord extends Model {
    static associate(models) {
      MedicalRecord.belongsTo(models.Patient, {
        foreignKey: 'patientId',
        as: 'patient'
      });
    }
  }
  
  MedicalRecord.init({
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'patients',
        key: 'id'
      }
    },
    recordType: {
      type: DataTypes.ENUM('prescription', 'test_report', 'diagnosis', 'other'),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    uploadedBy: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'MedicalRecord',
    tableName: 'medical_records'
  });
  
  return MedicalRecord;
};