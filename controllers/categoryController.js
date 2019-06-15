const db = require('../models');

const { Category } = db;

const categoryController = {
  getCategories: async (req, res) => {
    const categories = await Category.findAll();
    if (req.params.categoryId) {
      const category = await Category.findByPk(req.params.categoryId);
      return res.render('admin/categories', { categories, category });
    }

    return res.render('admin/categories', { categories });
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
