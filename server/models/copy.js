'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class copy extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  copy.init({
    bookmarkid: DataTypes.INTEGER,
    userid: DataTypes.INTEGER,
    posting: DataTypes.STRING,
    title: DataTypes.STRING,
    writer: DataTypes.STRING,
    category: DataTypes.STRING,
    licecount: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'copy',
  });
  return copy;
};