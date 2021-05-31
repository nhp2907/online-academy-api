require('dotenv').config();
const {Sequelize} = require('sequelize');

const dbName = process.env.DB_NAME;
const username = process.env.DB_USERNAME;
const password = process.env.PASSWORD;
const sequelize = new Sequelize(dbName, username, password, {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
});

const runDb = () => {
    sequelize.authenticate().then(
        res => {
            console.log('Connection has been established successfully.');
        }
    ).catch(error => {
        console.error('Unable to connect to the database:', error);
    });
}

runDb();

module.exports = sequelize;