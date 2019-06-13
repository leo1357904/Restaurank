const fs = require('fs');
const db = require('../models');

const { Restaurant } = db;

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
      fs.readFile(file.path, (err, data) => {
        if (err) console.log('Error: ', err);
        fs.writeFile(`upload/${file.originalname}`, data, () => { //eslint-disable-line
          return Restaurant
            .create({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: file ? `/upload/${file.originalname}` : null,
            })
            .then(() => {
              req.flash('success_messages', 'restaurant was successfully created');
              return res.redirect('/admin/restaurants');
            });
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
      fs.readFile(file.path, (err, data) => {
        if (err) console.log('Error: ', err);
        fs.writeFile(`upload/${file.originalname}`, data, () => { //eslint-disable-line
          return Restaurant.findByPk(req.params.id)
            .then((restaurant) => {
              restaurant
                .update({
                  name: req.body.name,
                  tel: req.body.tel,
                  address: req.body.address,
                  opening_hours: req.body.opening_hours,
                  description: req.body.description,
                  image: file ? `/upload/${file.originalname}` : restaurant.image,
                })
                .then(() => {
                  req.flash('success_messages', 'restaurant was successfully to update');
                  res.redirect('/admin/restaurants');
                });
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
};

module.exports = adminController;