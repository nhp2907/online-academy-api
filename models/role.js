const sequelize = require('./db')
const {DataTypes} = require('sequelize');
const User = require('./user');

const Role = sequelize.define('Role', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        notNull: true,
    },
    role: {
        type: DataTypes.STRING,
        field: 'role'
    },
}, {
    tableName: 'role',
    timestamps: true,
    createdAt: 'created_date',
    updatedAt: 'updated_date',
})

module.exports = Role;
