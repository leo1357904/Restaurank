'use strict'; //eslint-disable-line

const bcrypt = require('bcrypt-nodejs');
const faker = require('faker');

module.exports = {
  up: (queryInterface, Sequelize) => { //eslint-disable-line
    queryInterface.bulkInsert('Users', [{
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: 1,
      name: 'root',
      image: 'https://i.imgur.com/Uzs2ty3.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      email: 'user1@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: 0,
      name: 'user1',
      image: 'https://i.imgur.com/Uzs2ty3.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      email: 'user2@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: 0,
      name: 'user2',
      image: 'https://i.imgur.com/Uzs2ty3.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      email: 'admin@example.com',
      password: bcrypt.hashSync('0000', bcrypt.genSaltSync(10), null),
      isAdmin: 1,
      name: 'admin',
      image: 'https://i.imgur.com/Uzs2ty3.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      email: 'user@example.com',
      password: bcrypt.hashSync('0000', bcrypt.genSaltSync(10), null),
      isAdmin: 0,
      name: 'user',
      image: 'https://i.imgur.com/Uzs2ty3.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});

    queryInterface.bulkInsert(
      'Categories',
      ['中式料理', '日本料理', '義大利料理', '墨西哥料理', '素食料理', '美式料理', '複合式料理']
        .map((item, index) => ({
          id: index + 1,
          name: item,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
      {},
    );

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
          CategoryId: Math.floor(Math.random() * 5) + 1,
          viewCounts: 0,
        })),
      {},
    );
  },
  down: (queryInterface, Sequelize) => { //eslint-disable-line
    queryInterface.bulkDelete('Users', null, {});
    queryInterface.bulkDelete('Categories', null, {});
    return queryInterface.bulkDelete('Restaurants', null, {});
  },
};
