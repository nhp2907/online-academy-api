const moment = require('moment')
const sequelize = require('./db')
const {DataTypes, NUMBER} = require('sequelize');
const Role = require('./role');
const Instructor = require('./instructor');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        notNull: true,
    },
    firstName: {
        type: DataTypes.STRING,
        field: 'first_name'
    },
    lastName: {
        type: DataTypes.STRING,
        field: 'last_name'
    },
    email: {
        type: DataTypes.STRING,
        field: 'email'
    },
    image: {
        type: DataTypes.STRING,
        field: 'image'
    },
    info: {
        type: DataTypes.STRING,
        field: 'info'
    },
    job: {
        type: DataTypes.STRING,
        field: 'job'
    },
    gender: {
        type: DataTypes.INTEGER
    },
    username: {
        type: DataTypes.STRING(45)
    },
    password: {
        type: DataTypes.STRING
    },
    birthday: {
        type: DataTypes.DATE
    },
    street: {
        type: DataTypes.STRING,
        field: 'address_street'
    },
    district: {
        type: DataTypes.STRING
    },
    city: {
        type: DataTypes.STRING
    },
    country: {
        type: DataTypes.STRING
    },
    roleId: {
        type: DataTypes.NUMBER,
    },
    status: DataTypes.NUMBER,
    createdDate: {
        type: DataTypes.DATE,
        get() {
            return moment(this.getDataValue('updatedDate')).format('DD/MM/yyyy HH:mm');
        }
    },
    updatedDate:  {
        type: DataTypes.DATE,
        get() {
            return moment(this.getDataValue('updatedDate')).format('DD/MM/yyyy h:mm:ss');
        }
    },
}, {
    tableName: 'user',
    underscored: true,
    timestamps: true,
    createdAt: 'createdDate',
    updatedAt: 'updatedDate',
})

module.exports = User;
