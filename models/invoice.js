const {DataTypes} = require('sequelize');
const Coupon = require('./coupon');
const sequelize = require('./db');

const Invoice = sequelize.define('invoice', {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
    },
    totalPrice: DataTypes.FLOAT,
    orderDate: DataTypes.DATE,
    paidDate: DataTypes.DATE,
    refundDate: DataTypes.DATE,
    userId: {
        type: DataTypes.INTEGER,
        defaultValue: null
    }
}, {
    underscored: true,
    tableName: 'invoice',
    timestamps: true,
    createdAt: 'createdDate',
    updatedAt: 'updatedDate'
})

module.exports = Invoice;

