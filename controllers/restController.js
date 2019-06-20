const db = require('../models');

const {
  Restaurant,
  Category,
  User,
  Comment,
} = db;
const pageLimit = 10;

const restController = {
  getRestaurants: async (req, res) => {
    let offset = 0;
    const whereQuery = {};
    let categoryId = '';

    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit;
    }
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId);
      whereQuery.categoryId = categoryId;
    }

    const result = await Restaurant.findAndCountAll({
      include: Category,
      where: whereQuery,
      order: [['id', 'ASC']],
      offset,
      limit: pageLimit,
    });

    const data = result.rows.map(r => ({
      ...r.dataValues,
      description: r.dataValues.description.substring(0, 50),
      isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(r.id),
      isLiked: req.user.LikedRestaurants.map(d => d.id).includes(r.id),
    }));

    // data for pagination
    const page = Number(req.query.page) || 1;
    const pages = Math.ceil(result.count / pageLimit);
    const totalPage = Array.from({ length: pages }).map((item, index) => index + 1);
    const prev = page - 1 < 1 ? 1 : page - 1;
    const next = page + 1 > pages ? pages : page + 1;

    const categories = await Category.findAll();
    return res.render(
      'restaurants',
      {
        restaurants: data,
        categories,
        categoryId,
        page,
        totalPage,
        prev,
        next,
      },
    );
  },

  getRestaurant: async (req, res) => {
    const restaurant = await Restaurant.findByPk(
      req.params.restaurantId,
      {
        include: [
          Category,
          { model: User, as: 'FavoritedUsers' },
          { model: User, as: 'LikedUsers' },
          { model: Comment, include: [User] },
        ],
      },
    );
    await restaurant.update({ viewCounts: restaurant.viewCounts + 1 });

    const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(req.user.id);
    const isLiked = restaurant.LikedUsers.map(d => d.id).includes(req.user.id);
    return res.render('restaurant', { restaurant, isFavorited, isLiked });
  },

  getFeeds: async (req, res) => {
    const restaurants = await Restaurant.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [Category],
    });

    const comments = await Comment.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [User, Restaurant],
    });
    return res.render('feeds', {
      restaurants,
      comments,
    });
  },

  getRestaurantDashboard: async (req, res) => {
    const { restaurantId } = req.params;

    const restaurant = await Restaurant.findByPk(
      restaurantId,
      {
        include: [
          Category,
          Comment,
        ],
      },
    );

    const commentCount = restaurant.Comments.length;

    return res.render('restDashboard', { restaurant, commentCount });
  },
};

module.exports = restController;
