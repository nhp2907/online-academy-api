const sequelize = require('./db')
const {DataTypes} = require('sequelize');
const Course = require('./course');

const Level = sequelize.define('Level', {
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
    tableName: 'level',
    timestamps: true,
    createdAt: 'created_date',
    updatedAt: 'updated_date',
})

module.exports = Level;