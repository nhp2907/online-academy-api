const sequelize = require('./db')
const {DataTypes} = require('sequelize');
const Course = require('./course');

const Advancement = sequelize.define('Advancement', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        notNull: true,
    },
    description: {
        type: DataTypes.STRING,
        field: 'description'
    },
}, {
    tableName: 'advancement',
    timestamps: true,
    createdAt: 'created_date',
    updatedAt: 'updated_date',
})



module.exports = Advancement;