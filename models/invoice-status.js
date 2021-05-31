const sequelize = require('./db')
const {DataTypes} = require('sequelize')

const InvoiceStatus = sequelize.define('invoiceStatus', {
    id : {
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    status: DataTypes.STRING,
}, {
    tableName: 'invoice_status',
    underscored:true,
    timestamps: true,
    createdAt: 'createdDate',
    updatedAt: 'updatedDate'
})

module.exports = InvoiceStatus;
