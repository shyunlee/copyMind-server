'use strict';
const {
  Model
} = require('sequelize');
const copy = require('./copy');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.copy, {
        foreignKey: 'id'
      })

      this.belongsToMany(models.copy,{
        through : 'userBookmark',
        foreignKey : 'userId'
      })
    }
  };
  
  users.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    userName:DataTypes.STRING
  }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};