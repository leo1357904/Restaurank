const express = require('express');
const multer = require('multer');
const restController = require('../controllers/restController.js');
const adminController = require('../controllers/adminController.js');
const userController = require('../controllers/userController.js');
const categoryController = require('../controllers/categoryController.js');
const commentController = require('../controllers/commentController.js');
const passport = require('../config/passport');

const router = express.Router();
const upload = multer({ dest: 'temp/' });

const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/signin');
};
const authenticatedAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.isAdmin) {
      return next();
    }
    return res.redirect('/');
  }
  return res.redirect('/signin');
};

router.get('/signup', userController.signUpPage);
router.post('/signup', userController.signUp);
router.get('/signin', userController.signInPage);
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn);
router.get('/logout', userController.logout);

// 前台
router.get('/', authenticated, (req, res) => res.redirect('/restaurants'));
router.get('/restaurants', authenticated, restController.getRestaurants);
router.get('/restaurants/feeds', authenticated, restController.getFeeds);
router.get('/restaurants/top', authenticated, restController.getTopRestaurants);
router.get('/restaurants/:restaurantId', authenticated, restController.getRestaurant);
router.get('/restaurants/:restaurantId/dashboard', authenticated, restController.getRestaurantDashboard);

router.post('/comments', authenticated, commentController.postComment);
router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment);

router.get('/users/top', authenticated, userController.getTopUser);
router.get('/users/:userId', authenticated, userController.getUser);
router.get('/users/:userId/edit', authenticated, userController.editUser);
router.put('/users/:userId', authenticated, upload.single('image'), userController.putUser);

router.post('/favorite/:restaurantId', authenticated, userController.addFavorite);
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite);
router.post('/like/:restaurantId', authenticated, userController.addLike);
router.delete('/like/:restaurantId', authenticated, userController.removeLike);

router.post('/following/:userId', authenticated, userController.addFollowing);
router.delete('/following/:userId', authenticated, userController.removeFollowing);

// 後台
router.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'));
router.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants);
router.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant);
router.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant);
router.get('/admin/restaurants/:restaurantId', authenticatedAdmin, adminController.getRestaurant);
router.get('/admin/restaurants/:restaurantId/edit', authenticatedAdmin, adminController.editRestaurant);
router.put('/admin/restaurants/:restaurantId', authenticatedAdmin, upload.single('image'), adminController.putRestaurant);
router.delete('/admin/restaurants/:restaurantId', authenticatedAdmin, adminController.deleteRestaurant);

router.get('/admin/users', authenticatedAdmin, adminController.editUsers);
router.put('/admin/users/:userId', authenticatedAdmin, adminController.putUsers);

router.get('/admin/categories', authenticatedAdmin, categoryController.getCategories);
router.post('/admin/categories', authenticatedAdmin, categoryController.postCategory);
router.get('/admin/categories/:categoryId', authenticatedAdmin, categoryController.getCategories);
router.put('/admin/categories/:categoryId', authenticatedAdmin, categoryController.putCategory);
router.delete('/admin/categories/:categoryId', authenticatedAdmin, categoryController.deleteCategory);

module.exports = router;
