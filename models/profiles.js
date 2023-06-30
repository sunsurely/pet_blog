'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profiles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Users, {
        targetKey: 'userId',
        foreignKey: 'UserId',
      });
    }
  }
  Profiles.init(
    {
      UserId: {
        allowNull: false, // NOT NULL
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      Nickname: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      userComment: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      userImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Profiles',
    },
  );
  return Profiles;
};
