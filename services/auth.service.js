const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const UserModel = require("../schemas/user.schema");

/**
 * Verify authentication middleware
 * @param req
 * @param res
 * @param next
 */
const verifyJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.substring(7);
    console.log(token)
    req.session.returnTo = req.originalUrl;
    if (req.originalUrl === '/logout' || !token) {
        next();
    } else {
        jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
            if (err) {
                console.log("err")
                throw new Error("Token is invalid!")
            }

            const user = await UserModel.findOne({username: decoded.username}).exec();
            delete user.password;
            res.locals.user = user.toJSON();
            next();
        })
    }
}

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

    const hashedPassword = bcrypt.hashSync(user.password, 10);
    user.password = hashedPassword;
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
        const user = await UserModel.findOne({username}).exec();
        console.log(user);
        if (user && bcrypt.compareSync(password, user.password)) {
            return jwt.sign({username}, process.env.JWT_SECRET_KEY);
        }

        return null;
    } catch (err) {
        console.log(err)
        // throw err;
    }
}

module.exports = {
    verifyJwt,
    signup,
    login
};