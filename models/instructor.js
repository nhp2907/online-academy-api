const sequelize = require('./db')
const User = require("./user");
const Course = require("./course");
const {DataTypes} = require('sequelize')

const Instructor = sequelize.define('instructor', {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        field: 'id',
    },
    rating: DataTypes.FLOAT,
    numReview:  DataTypes.INTEGER,
    shortDescription: DataTypes.STRING,
    description: DataTypes.STRING,
    numStudentEnroll: DataTypes.INTEGER,
    numCourse: DataTypes.INTEGER,
    createdDate: DataTypes.DATE,
    updatedDate: DataTypes.DATE
}, {
    tableName: 'instructor',
    underscored: true,
    timestamps: true,
    createdAt: 'createdDate',
    updatedAt: 'updatedDate'
})

module.exports = Instructor;
