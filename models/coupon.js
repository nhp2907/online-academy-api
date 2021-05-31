const sequelize = require('./db')
const {DataTypes} = require('sequelize')

const Coupon = sequelize.define('coupon', {
    id : {
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    name: DataTypes.STRING,
    percentDiscount: DataTypes.INTEGER,
    amountDiscount: DataTypes.INTEGER,
    endDate: DataTypes.DATE,
    code: DataTypes.STRING
}, {
    tableName: 'coupon',
    underscored:true,
    timestamps: true,
    createdAt: 'createdDate',
    updatedAt: 'updatedDate'
})

module.exports = Coupon;
