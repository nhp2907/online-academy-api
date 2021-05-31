const sequelize = require('./db')
const {DataTypes} = require('sequelize')

const CourseChapter = sequelize.define('courseChapter', {
    id : {
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    courseId: DataTypes.INTEGER,
    count: DataTypes.INTEGER,
    title: DataTypes.STRING,
    createdDate: DataTypes.DATE,
    updatedDate: DataTypes.DATE,
}, {
    tableName: 'course_chapter',
    underscored:true,
    timestamps: true,
    createdAt: 'createdDate',
    updatedAt: 'updatedDate'
})

module.exports = CourseChapter;
