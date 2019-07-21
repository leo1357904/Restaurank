const db = require('../../models');
const adminService = require('../../services/adminService.js');

const { Restaurant, Category } = db;

const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      res.json(data);
    });
  },

  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, (data) => {
      res.json(data);
    });
  },

  getCategories: async (req, res) => {
    if (req.params.categoryId) {
      return adminService.getCategory(req, res, (data) => {
        res.json(data);
      });
    }
    return adminService.getCategories(req, res, (data) => {
      res.json(data);
    });
  },
};

module.exports = adminController;
