const imgur = require('imgur-node-api');
const db = require('../models');
const adminService = require('../services/adminService.js');

const { Restaurant, User, Category } = db;
const IMGUR_CLIENT_ID = 'cc4db0da4aafde9';

const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      res.render('admin/restaurants', data);
    });
  },

  createRestaurant: async (req, res) => {
    const categories = await Category.findAll();
    res.render('admin/create', { categories });
  },

  postRestaurant: (req, res) => { //eslint-disable-line
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist");
      return res.redirect('back');
    }

    const { file } = req; // equal to const file = req.file
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => { //eslint-disable-line
        return Restaurant.create({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: img.data.link, //
          // image: file ? img.data.link : null,
          CategoryId: req.body.categoryId,
          viewCounts: 0,
        }).then(() => {
          req.flash('success_messages', 'restaurant was successfully created');
          return res.redirect('/admin/restaurants');
        });
      });
    } else {
      return Restaurant.create({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        image: null,
        CategoryId: req.body.categoryId,
        viewCounts: 0,
      }).then(() => {
        req.flash('success_messages', 'restaurant was successfully created');
        return res.redirect('/admin/restaurants');
      });
    }
  },

  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, (data) => {
      res.render('admin/restaurant', data);
    });
  },

  editRestaurant: async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.restaurantId);
    const categories = await Category.findAll();
    res.render('admin/create', { categories, restaurant });
  },

  putRestaurant: (req, res) => { //eslint-disable-line
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist");
      return res.redirect('back');
    }

    const { file } = req;
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => { // eslint-disable-line
        return Restaurant.findByPk(req.params.restaurantId)
          .then((restaurant) => {
            restaurant
              .update({
                name: req.body.name,
                tel: req.body.tel,
                address: req.body.address,
                opening_hours: req.body.opening_hours,
                description: req.body.description,
                image: img.data.link, //
                // image: file ? img.data.link : restaurant.image,
                CategoryId: req.body.categoryId,
              })
              .then(() => {
                req.flash('success_messages', 'restaurant was successfully to update');
                res.redirect('/admin/restaurants');
              });
          });
      });
    } else {
      return Restaurant.findByPk(req.params.restaurantId)
        .then((restaurant) => {
          restaurant
            .update({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: restaurant.image,
              CategoryId: req.body.categoryId,
            })
            .then(() => {
              req.flash('success_messages', 'restaurant was successfully to update');
              res.redirect('/admin/restaurants');
            });
        });
    }
  },

  deleteRestaurant: (req, res) => {
    Restaurant
      .findByPk(req.params.restaurantId)
      .then((restaurant) => {
        restaurant
          .destroy()
          .then(() => {
            res.redirect('/admin/restaurants');
          });
      });
  },

  editUsers: async (req, res) => {
    const users = await User.findAll();
    res.render('admin/users', { users });
  },

  putUsers: async (req, res) => {
    const user = await User.findByPk(req.params.userId);
    const role = user.isAmin ? 'User' : 'Admin';
    await user.update({ isAdmin: !user.isAdmin ? 1 : 0 });
    req.flash('success_messages', `Set ${user.name}(id:${user.id}) to ${role}`);
    res.redirect('/admin/users');
  },
};

module.exports = adminController;
