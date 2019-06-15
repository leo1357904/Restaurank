const multer = require('multer');
const restController = require('../controllers/restController.js');
const adminController = require('../controllers/adminController.js');
const userController = require('../controllers/userController.js');
const categoryController = require('../controllers/categoryController.js');
const commentController = require('../controllers/commentController.js');

const upload = multer({ dest: 'temp/' });

module.exports = (app, passport) => {
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

  app.get('/signup', userController.signUpPage);
  app.post('/signup', userController.signUp);
  app.get('/signin', userController.signInPage);
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn);
  app.get('/logout', userController.logout);

  // 前台
  app.get('/', authenticated, (req, res) => res.redirect('/restaurants'));
  app.get('/restaurants', authenticated, restController.getRestaurants);
  app.get('/restaurants/:restaurantId', authenticated, restController.getRestaurant);

  app.post('/comments', authenticated, commentController.postComment);
  app.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment);

  app.get('/users/:userId', authenticated, userController.getUser);
  app.get('/users/:userId/edit', authenticated, userController.editUser);
  app.put('/users/:userId', authenticated, upload.single('image'), userController.putUser);

  // 後台
  app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'));
  app.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants);
  app.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant);
  app.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant);
  app.get('/admin/restaurants/:restaurantId', authenticatedAdmin, adminController.getRestaurant);
  app.get('/admin/restaurants/:restaurantId/edit', authenticatedAdmin, adminController.editRestaurant);
  app.put('/admin/restaurants/:restaurantId', authenticatedAdmin, upload.single('image'), adminController.putRestaurant);
  app.delete('/admin/restaurants/:restaurantId', authenticatedAdmin, adminController.deleteRestaurant);

  app.get('/admin/users', authenticatedAdmin, adminController.editUsers);
  app.put('/admin/users/:userId', authenticatedAdmin, adminController.putUsers);

  app.get('/admin/categories', authenticatedAdmin, categoryController.getCategories);
  app.post('/admin/categories', authenticatedAdmin, categoryController.postCategory);
  app.get('/admin/categories/:categoryId', authenticatedAdmin, categoryController.getCategories);
  app.put('/admin/categories/:categoryId', authenticatedAdmin, categoryController.putCategory);
  app.delete('/admin/categories/:categoryId', authenticatedAdmin, categoryController.deleteCategory);
};
