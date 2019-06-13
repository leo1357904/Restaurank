const imgur = require('imgur-node-api');
const db = require('../models');

const { Restaurant, User } = db;
const IMGUR_CLIENT_ID = 'cc4db0da4aafde9';

const adminController = {
  getRestaurants: (req, res) => {
    Restaurant.findAll()
      .then((restaurants) => {
        res.render('admin/restaurants', { restaurants });
      });
  },

  createRestaurant: (req, res) => {
    res.render('admin/create');
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
          image: file ? img.data.link : null,
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
      }).then(() => {
        req.flash('success_messages', 'restaurant was successfully created');
        return res.redirect('/admin/restaurants');
      });
    }
  },

  getRestaurant: (req, res) => {
    Restaurant
      .findByPk(req.params.id)
      .then(restaurant => res.render('admin/restaurant', { restaurant }));
  },

  editRestaurant: (req, res) => {
    Restaurant
      .findByPk(req.params.id)
      .then(restaurant => res.render('admin/create', { restaurant }));
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
        return Restaurant.findByPk(req.params.id)
          .then((restaurant) => {
            restaurant
              .update({
                name: req.body.name,
                tel: req.body.tel,
                address: req.body.address,
                opening_hours: req.body.opening_hours,
                description: req.body.description,
                image: file ? img.data.link : restaurant.image,
              })
              .then(() => {
                req.flash('success_messages', 'restaurant was successfully to update');
                res.redirect('/admin/restaurants');
              });
          });
      });
    } else {
      return Restaurant.findByPk(req.params.id)
        .then((restaurant) => {
          restaurant
            .update({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: restaurant.image,
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
      .findByPk(req.params.id)
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
