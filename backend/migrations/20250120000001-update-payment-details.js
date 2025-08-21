'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('payments', 'payerEmail', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('payments', 'payerName', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('payments', 'paypalOrderId', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('payments', 'transactionDetails', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('payments', 'payerEmail');
    await queryInterface.removeColumn('payments', 'payerName');
    await queryInterface.removeColumn('payments', 'paypalOrderId');
    await queryInterface.removeColumn('payments', 'transactionDetails');
  }
};