const UserRole = require("../constant/UserRole");
const UserModel = require("../schemas/user.schema");
const jwt = require('jsonwebtoken')

const verifyAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).send({
            message: 'Unauthorized'
        })
        return;
    }
    const token = authHeader.substring(7);
    console.log('token', token)
    if (req.originalUrl === '/logout' || !token) {
        next();
    } else {
        jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
            if (err) {
                console.log("err")
                throw new Error("Token is invalid!")
            }
            console.log(decoded)
            const user = await UserModel.findOne({username: decoded.username}).exec();
            if (user.roleId !== UserRole.Admin) {
                res.status(401).send({
                    message: "You are no authorized!"
                })
            } else {
                delete user.password;
                res.locals.user = user.toJSON();
                next();
            }
        })
    }
}

module.exports = {
    verifyAdmin,
}