const moment = require('moment')
const sequelize = require('./db');
const {DataTypes} = require('sequelize');

const CourseReview = sequelize.define('courseReview', {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    content: DataTypes.STRING,
    rating: DataTypes.INTEGER,
    userId: {
        type: DataTypes.INTEGER,
        defaultValue: null
    },
    createdDate: {
        type: DataTypes.DATE,
        get() {
            return moment(this.getDataValue('createdDate')).format('DD/MM/yyyy h:mm:ss');
        }
    },
    updatedDate: {
        type: DataTypes.DATE,
        get() {
            return moment(this.getDataValue('updatedDate')).format('DD/MM/yyyy h:mm:ss');
        }
    },
}, {
    underscored: true,
    timestamps: true,
    createdAt: 'createdDate',
    updatedAt: 'updatedDate',
    tableName: 'course_review'
})

module.exports = CourseReview;