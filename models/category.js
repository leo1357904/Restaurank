'use strict'; // eslint-disable-line

module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    name: DataTypes.STRING,
  }, {});
  Category.associate = function (models) { // eslint-disable-line
    // associations can be defined here
    Category.hasMany(models.Restaurant);
  };
  return Category;
};
