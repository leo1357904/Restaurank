'use strict'; //eslint-disable-line

module.exports = {
  up: (queryInterface, Sequelize) => { //eslint-disable-line
    return queryInterface.createTable('Comments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      text: {
        type: Sequelize.STRING,
      },
      UserId: {
        type: Sequelize.INTEGER,
      },
      RestaurantId: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => { //eslint-disable-line
    return queryInterface.dropTable('Comments');
  },
};
