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

      this.belongsTo(models.users,{
        foreignKey : 'myPostingId',
      })

      this.belongsToMany(models.users,{
        through : models.userBookmark,
        foreignKey : 'bookmarkId'
      })
    }
  };
  copy.init({
    myPostingId: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    title: DataTypes.STRING,
    writer: DataTypes.STRING,
    category: DataTypes.STRING,
    likeCount: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'copy',
  });
  return copy;
};