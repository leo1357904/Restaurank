const db = require('../models');

const { Comment } = db;

const commentController = {
  postComment: async (req, res) => {
    await Comment.create({
      text: req.body.text,
      RestaurantId: req.body.restaurantId,
      UserId: req.user.id,
    });
    return res.redirect(`/restaurants/${req.body.restaurantId}`);
  },

  deleteComment: async (req, res) => {
    const comment = await Comment.findByPk(req.params.id);
    await comment.destroy();
    return res.redirect(`/restaurants/${comment.RestaurantId}`);
  },
};

module.exports = commentController;
