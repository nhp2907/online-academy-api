const sequelize = require('./db')
const {DataTypes} = require('sequelize');
const SubCategory = require('./sub-category');
const CategoryLink = require('./category-link');

const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        notNull: true,
    },
    name: {
        type: DataTypes.STRING,
        field: 'name'
    },
    logo: {
        type: DataTypes.STRING,
        field: 'logo'
    },
    image: {
        type: DataTypes.STRING,
        field: 'image'
    },
    status: {
        type: DataTypes.NUMBER,
        field: 'status'
    }
}, {
    tableName: 'category',
    timestamps: true,
    createdAt: 'created_date',
    updatedAt: 'updated_date',
})



module.exports = Category;