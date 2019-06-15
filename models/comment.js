'use strict'; // eslint-disable-line

module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    text: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    RestaurantId: DataTypes.INTEGER,
  }, {});
  Comment.associate = function (models) { // eslint-disable-line
    // associations can be defined here
    Comment.belongsTo(models.Restaurant);
    Comment.belongsTo(models.User);
  };
  return Comment;
};
