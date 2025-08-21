'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('payments', 'upiId', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('payments', 'phoneNumber', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('payments', 'upiId');
    await queryInterface.removeColumn('payments', 'phoneNumber');
  }
};