const sequelize = require('./db')
const {DataTypes} = require('sequelize');
const Category = require('./category');
const CategoryLink = require('./category-link');

const SubCategory = sequelize.define('SubCategory', {
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
    status: {
        type: DataTypes.NUMBER,
        field: 'status'
    }
}, {
    tableName: 'sub_category',
    timestamps: true,
    createdAt: 'created_date',
    updatedAt: 'updated_date',
})



module.exports = SubCategory;



