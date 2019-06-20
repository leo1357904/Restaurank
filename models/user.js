'use strict'; // eslint-disable-line

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.INTEGER,
    image: DataTypes.STRING,
  }, {});
  User.associate = function (models) { // eslint-disable-line
    // associations can be defined here
    User.hasMany(models.Comment);
    User.belongsToMany(models.Restaurant, {
      through: models.Favorite,
      foreignKey: 'UserId',
      as: 'FavoritedRestaurants',
    });
  };
  return User;
};
