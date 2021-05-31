const sequelize = require('./db')
const {DataTypes} = require('sequelize')

const PaymentType = sequelize.define('paymentType', {
    id : {
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    type: DataTypes.STRING,
}, {
    tableName: 'payment_type',
    underscored:true,
    timestamps: true,
    createdAt: 'createdDate',
    updatedAt: 'updatedDate'
})

module.exports = PaymentType;
