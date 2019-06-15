const bcrypt = require('bcrypt-nodejs');
const imgur = require('imgur-node-api');
const db = require('../models');

const { User } = db;
const IMGUR_CLIENT_ID = 'cc4db0da4aafde9';

const userController = {
  signUpPage: (req, res) => res.render('signup'),

  signUp: (req, res) => {
    // confirm password
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！');
      return res.redirect('/signup');
    }
    // confirm unique user
    return User
      .findOne({ where: { email: req.body.email } })
      .then((user) => {
        if (user) {
          req.flash('error_messages', '信箱重複！');
          return res.redirect('/signup');
        }
        return User.create({
          name: req.body.name,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
          isAdmin: 0,
          image: 'https://i.imgur.com/Uzs2ty3.jpg',
        }).then(() => {
          req.flash('success_messages', '成功註冊帳號！');
          return res.redirect('/signin');
        });
      });
  },

  signInPage: (req, res) => res.render('signin'),

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！');
    if (req.user.isAdmin) {
      return res.redirect('/admin/restaurants');
    }
    return res.redirect('/restaurants');
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！');
    req.logout();
    res.redirect('/signin');
  },

  getUser: async (req, res) => {
    const { userId } = req.params;
    const profile = await User.findByPk(userId);

    const canEdit = Number(req.params.userId) === req.user.id;

    return res.render('profile', { profile, canEdit });
  },

  editUser: async (req, res) => {
    const userId = Number(req.params.userId);
    if (userId !== req.user.id) {
      return res.redirect(`/users/${req.user.id}/edit`);
    }
    const user = await User.findByPk(userId);

    return res.render('editProfile', { user });
  },

  putUser: async (req, res) => {
    const { id } = req.user;
    const userId = Number(req.params.userId);
    if (userId !== id) {
      return res.redirect(`/users/${id}`);
    }

    const user = await User.findByPk(req.params.userId);
    const { file } = req;

    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      return imgur.upload(file.path, async (err, img) => {
        await user.update({
          name: req.body.name,
          image: img.data.link,
        });
        req.flash('success_messages', 'User Profile is successfully updated');
        return res.redirect(`/users/${id}`);
      });
    }
    await user.update({
      name: req.body.name,
      image: req.body.image,
    });
    req.flash('success_messages', 'User Profile is successfully updated');
    return res.redirect(`/users/${id}`);
  },
};

module.exports = userController;
