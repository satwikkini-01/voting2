const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
});

const Vote = sequelize.define('Vote', {
  participant1: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  participant2: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

module.exports = Vote;
