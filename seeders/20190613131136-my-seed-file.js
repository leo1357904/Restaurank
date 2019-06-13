'use strict'; //eslint-disable-line

const bcrypt = require('bcrypt-nodejs');
const faker = require('faker');

module.exports = {
  up: (queryInterface, Sequelize) => { //eslint-disable-line
    queryInterface.bulkInsert('Users', [{
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: true,
      name: 'root',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      email: 'user1@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: false,
      name: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      email: 'user2@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: false,
      name: 'user2',
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});

    return queryInterface.bulkInsert(
      'Restaurants',
      Array
        .from({ length: 50 })
        .map(d => ({ //eslint-disable-line
          name: faker.name.findName(),
          tel: faker.phone.phoneNumber(),
          address: faker.address.streetAddress(),
          opening_hours: '08:00',
          image: 'https://via.placeholder.com/286x180',
          description: faker.lorem.text(),
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
      {},
    );
  },
  down: (queryInterface, Sequelize) => { //eslint-disable-line
    queryInterface.bulkDelete('Users', null, {});
    return queryInterface.bulkDelete('Restaurants', null, {});
  },
};
