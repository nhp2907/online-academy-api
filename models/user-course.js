const sequelize = require('./db');
const {DataTypes} = require('sequelize');

const UserCourse = sequelize.define('userCourse', {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
    },
    createdDate: DataTypes.DATE,
    updatedDate: DataTypes.DATE,
    userId: {
        type: DataTypes.INTEGER,
        defaultValue: null
    },
    type: DataTypes.INTEGER,
}, {
    underscored: true,
    timestamps: true,
    createdAt: 'createdDate',
    updatedAt: 'updatedDate',
    tableName: 'user_course'
})

module.exports = UserCourse;