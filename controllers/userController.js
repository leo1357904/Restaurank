const bcrypt = require('bcrypt-nodejs');
const imgur = require('imgur-node-api');
const uniqBy = require('lodash.uniqby');
const db = require('../models');

const {
  User,
  Comment,
  Restaurant,
  Favorite,
  Like,
  Followship,
} = db;
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

    const profile = await User.findByPk(
      userId,
      {
        include: {
          model: Comment,
          include: Restaurant,
        },
      },
    );

    const commentCount = profile.Comments.length;
    const restaurantCount = uniqBy(profile.Comments, 'Restaurant.id').length;
    const canEdit = Number(req.params.userId) === req.user.id;

    return res.render(
      'profile',
      {
        profile,
        canEdit,
        commentCount,
        restaurantCount,
      },
    );
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

  addFavorite: async (req, res) => {
    await Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId,
    });
    return res.redirect('back');
  },

  removeFavorite: async (req, res) => {
    const favorite = await Favorite.findOne(
      {
        where: {
          UserId: req.user.id,
          RestaurantId: req.params.restaurantId,
        },
      },
    );
    await favorite.destroy();
    return res.redirect('back');
  },

  addLike: async (req, res) => {
    await Like.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId,
    });
    return res.redirect('back');
  },

  removeLike: async (req, res) => {
    const like = await Like.findOne(
      {
        where: {
          UserId: req.user.id,
          RestaurantId: req.params.restaurantId,
        },
      },
    );
    await like.destroy();
    return res.redirect('back');
  },

  getTopUser: async (req, res) => {
    // 撈出所有 User 與 followers 資料
    const usersData = await User.findAll({
      include: [
        { model: User, as: 'Followers' },
      ],
    });
    // 整理 users 資料
    const users = usersData
      .map(user => ({
        ...user.dataValues,
        // 計算追蹤者人數
        FollowerCount: user.Followers.length,
        // 判斷目前登入使用者是否已追蹤該 User 物件
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id),
      }))
      // 依追蹤者人數排序清單
      .sort((a, b) => b.FollowerCount - a.FollowerCount);
    return res.render('topUser', { users });
  },

  addFollowing: async (req, res) => {
    await Followship.create({
      followerId: req.user.id,
      followingId: req.params.userId,
    });
    return res.redirect('back');
  },

  removeFollowing: async (req, res) => {
    const followship = await Followship.findOne(
      {
        where: {
          followerId: req.user.id,
          followingId: req.params.userId,
        },
      },
    );
    await followship.destroy();
    return res.redirect('back');
  },
};

module.exports = userController;
