const express = require('express')
const UserRole = require("../constant/UserRole");
const AuthService = require("../services/auth.service");
const UserModel = require("../schemas/user.schema");


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
        res.send({
            token, user: savedUser
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
    if (!user.status) {
        res.status(400).send({
            message: 'Account is disabled'
        })
        return;
    }
    delete user.password;
    res.send({
        token: token,
        user: user.toJSON()
    })
})

module.exports = router;