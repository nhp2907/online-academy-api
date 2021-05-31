const {DataTypes} = require('sequelize');
const sequelize = require('./db');
const moment = require('moment');

const Course = sequelize.define('course', {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    name: DataTypes.STRING,
    headline: DataTypes.STRING,
    image: DataTypes.STRING,
    concurrency: DataTypes.STRING,
    price: DataTypes.DOUBLE,
    prePrice: DataTypes.DOUBLE,
    discount: DataTypes.INTEGER,
    language: DataTypes.STRING,
    description: DataTypes.STRING,
    rating: DataTypes.FLOAT,
    numReview: DataTypes.FLOAT,
    numLecture:  DataTypes.FLOAT,
    status: DataTypes.STRING,
    numLecture: DataTypes.FLOAT,
    estimateContentLength: DataTypes.STRING,
    numStudentEnroll: DataTypes.INTEGER,
    createdDate: DataTypes.DATE,
    updatedDate: DataTypes.DATE,
    updatedDate: {
        type: DataTypes.DATE,
        get() {
            return moment(this.getDataValue('updatedDate')).format('DD/MM/yyyy h:mm:ss');
        }
    },
    status: DataTypes.STRING,
}, {
    underscored: true,
    tableName: 'course',
    timestamps: true,
    createdAt: 'createdDate',
    updatedAt: 'updatedDate'
})

module.exports = Course;

