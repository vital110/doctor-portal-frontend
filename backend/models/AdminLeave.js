'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AdminLeave extends Model {
    static associate(models) {
      // define association here
    }
  }

  AdminLeave.init({
    adminName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    leaveDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'AdminLeave',
    tableName: 'admin_leaves'
  });

  return AdminLeave;
};