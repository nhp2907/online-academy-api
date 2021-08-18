const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const UserModel = require("../schemas/user.schema");
const {tokenExpiresTime} = require("../constant/configs");

/**
 * Verify authentication middleware
 * @param req
 * @param res
 * @param next
 */

/**
 * @param user
 */
const signup = async (user) => {
    console.log('user signup dto: ', user);
    if (await UserModel.findOne({username: user.username}).exec()) {
        throw new Error(`Username ${user.username} already existed`);
    }

    if (await UserModel.findOne({email: user.email}).exec()) {
        throw new Error(`Email ${user.email} already existed`);
    }

    user.password = bcrypt.hashSync(user.password, 10);
    console.log('user before save: ', user)
    return await UserModel.create(user);
}

/**
 * Login
 * @param username {string}
 * @param password {string}
 * @returns {Promise<string>}
 */
const login = async (username, password) => {
    console.log(username, password);
    try {
        const user = await UserModel.findOne({username, deleted: {$ne: true}}).exec();
        if (!user) {
            return null;
        }
        console.log(user);
        if (user && bcrypt.compareSync(password, user.password)) {
            return jwt.sign({username}, process.env.JWT_SECRET_KEY, {expiresIn: tokenExpiresTime});
        }

        return null;
    } catch (err) {
        console.log(err)
        // throw err;
    }
}

module.exports = {
    signup,
    login
};