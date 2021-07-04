const UserRole = require("../constant/UserRole");
const UserModel = require("../schemas/user.schema");
const jwt = require('jsonwebtoken')


const verifyJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.substring(7);
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
            console.log('user', user);
            res.locals.user = user.toJSON();
            next();
        })
    }
}

const verifyAdmin = (req, res, next) => {
    const user = res.locals.user;

    if (!user || user.roleId !== UserRole.Admin) {
        const message = {
            message: "You are not authorized!"
        };
        console.log(message);
        res.status(401).send(message)
        return;
    }

    next()
}

const verifyInstructor = (req, res, next) => {
    const user = res.locals.user;

    if (!user || user.roleId !== UserRole.Instructor) {
        const message = {
            message: "You are not authorized!"
        };
        console.log(message);
        res.status(401).send(message)
        return;
    }

    next()
}

module.exports = {
    verifyJwt,
    verifyAdmin,
    verifyInstructor
}