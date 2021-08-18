const express = require('express')
const UserRole = require("../constant/UserRole");
const AuthService = require("../services/auth.service");
const UserModel = require("../schemas/user.schema");
const randomstring = require('randomstring');
const jwt = require('jsonwebtoken')
const UserRtModel = require("../schemas/user-refresh-token.schema");
const {tokenExpiresTime} = require("../constant/configs");

const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
        const user = req.body;
        const rawPassword = user.password;
        console.log(user);
        user.roleId = user.roleId || UserRole.Student;
        user.role = 'Student';
        const cloneUser = {
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
            password: user.password,
            roleId: user.roleId,
            role: user.role
        }
        const savedUser = await AuthService.signup(cloneUser);
        delete savedUser.password
        const token = await AuthService.login(user.username, rawPassword)

        const refreshToken = randomstring.generate(80);
        await UserRtModel.create({userId: savedUser._id, refreshToken});

        res.send({
            token, user: savedUser, refreshToken
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: err.message
        })
    }
})

router.post('/login', async (req, res, next) => {
    const {username, password} = req.body;
    const token = await AuthService.login(username, password);
    if (token == null) {
        res.status(401).send({
            message: "Incorrect username or password!"
        })
    }
    const user = await UserModel.findOne({username, deleted: {$ne: true}});

    // save refresh token
    const refreshToken = randomstring.generate(80);
    await UserRtModel.updateOne({userId: user._id}, {userId: user._id, refreshToken}, {upsert: true}).exec()

    if (!user.status) {
        res.status(400).send({
            message: 'Account is disabled'
        })
        return;
    }
    delete user.password;
    res.send({
        token: token,
        refreshToken,
        user: user.toJSON()
    })
})

router.post('/refresh', async function (req, res) {
    try {

        const {accessToken, refreshToken} = req.body;
        const {username} = jwt.verify(accessToken, process.env.JWT_SECRET_KEY, {
            ignoreExpiration: true
        });
        console.log('username', username);
        const user = await UserModel.findOne({username}).exec();
        const ret = await UserRtModel.findOne({userId: user._id}).exec();
        console.log(ret)
        console.log(refreshToken)
        if (refreshToken === ret.refreshToken) {
            const token = jwt.sign({username}, process.env.JWT_SECRET_KEY, {expiresIn: tokenExpiresTime});
            return res.json({
                accessToken: token
            });
        }

        return res.status(400).json({
            message: 'Refresh token is revoked!'
        });
    } catch (er) {
        console.log(err);
        return res.status(400).json({
            message: er.message
        });
    }
})

module.exports = router;