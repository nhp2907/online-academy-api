const sequelize = require('./db')
const {DataTypes} = require('sequelize');
const Category = require('./category');
const SubCategory = require('./sub-category');
const Course = require('./course');
const Level = require('./level');
const Advancement = require('./advancement');
const Instructor = require('./instructor');
const User = require('./user');
const Role = require('./role');

const CategoryLink = sequelize.define('CategoryLink', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        notNull: true,
    },
    categoryId: {
        type: DataTypes.INTEGER,
        field: 'category_id',
        notNull: true,
        references: {
            model: Category,
            key: 'id'
        }
    },
    subCategoryId: {
        type: DataTypes.INTEGER,
        field: 'sub_category_id',
        notNull: true,
        references: {
            model: SubCategory,
            key: 'id'
        }
    }
}, {
    tableName: 'category_link',
    timestamps: true,
    underscored: true,
    createdAt: 'created_date',
    updatedAt: 'updated_date',
});

module.exports = CategoryLink;


