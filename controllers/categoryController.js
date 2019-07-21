const db = require('../models');
const adminService = require('../services/adminService.js');

const { Category } = db;

const categoryController = {
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

  postCategory: async (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', 'name didn\'t exist');
      return res.redirect('back');
    }
    await Category.create({
      name: req.body.name,
    });
    return res.redirect('/admin/categories');
  },

  putCategory: async (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', 'name didn\'t exist');
      return res.redirect('back');
    }
    const category = await Category.findByPk(req.params.categoryId);
    await category.update(req.body);
    return res.redirect('/admin/categories');
  },

  deleteCategory: async (req, res) => {
    const category = await Category.findByPk(req.params.categoryId);
    await category.destroy();
    return res.redirect('/admin/categories');
  },
};

module.exports = categoryController;
