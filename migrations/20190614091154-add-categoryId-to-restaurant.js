'use strict'; //eslint-disable-line

module.exports = {
  up: (queryInterface, Sequelize) => { //eslint-disable-line
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.addColumn('Restaurants', 'CategoryId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      reference: {
        model: 'Categories',
        key: 'id',
      },
    });
  },

  down: (queryInterface, Sequelize) => { //eslint-disable-line
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.removeColumn('Restaurants', 'CategoryId');
  },
};
