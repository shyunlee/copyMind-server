'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      this.hasMany(models.mypage,{
        foreignKey: 'id'
      })
      
      this.hasMany(models.copy,{
        foreignKey: 'id'
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