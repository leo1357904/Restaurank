'use strict'; // eslint-disable-line

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
  }, {});
  User.associate = function (models) { // eslint-disable-line
    // associations can be defined here
  };
  return User;
};
