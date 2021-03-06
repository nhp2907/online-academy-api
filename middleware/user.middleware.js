const UserRole = require("../constant/UserRole");
const UserModel = require("../schemas/user.schema");
const jwt = require('jsonwebtoken')


const verifyJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).send({
            message: 'Token not found'
        })
    }
    const token = authHeader.substring(7);
    if (req.originalUrl === '/logout') {
        next();
    } else {
        jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
            if (err) {
                console.log("err")
                // throw new Error("Token is invalid!")
                res.status(401).send({message: "Invalid token!"})
                return;
            }

            const user = await UserModel.findOne({username: decoded.username, deleted: {$ne: true}}).exec();
            if (!user) {
                res.static(400).send({message: 'User not found'})
            }
            delete user.password;
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