const imgur = require('imgur-node-api');
const db = require('../models');

const { Restaurant, User, Category } = db;
const IMGUR_CLIENT_ID = 'cc4db0da4aafde9';

const adminService = {
  getRestaurants: (req, res, callback) => {
    Restaurant
      .findAll({ include: [Category], order: [['id', 'ASC']] })
      .then((restaurants) => {
        callback({ restaurants });
      });
  },

  getRestaurant: (req, res, callback) => {
    Restaurant
      .findByPk(req.params.restaurantId, { include: [Category] })
      .then((restaurant) => {
        callback({ restaurant });
      });
  },

  getCategories: async (req, res, callback) => {
    const categories = await Category.findAll();
    callback({ categories });
  },

  getCategory: async (req, res, callback) => {
    const categories = await Category.findAll();
    const category = await Category.findByPk(req.params.categoryId);
    callback({ categories, category });
  },
};

module.exports = adminService;
