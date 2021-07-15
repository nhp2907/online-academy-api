const express = require('express')
const router = express.Router();
const UserModel = require("../schemas/user.schema");

router.get('/user', async (req, res) => {
    console.log('validate user')
    const query = req.query;
    if (query.username) {
        const users = await UserModel.find({username: query.username}).exec();
        if (users.length > 0) {
            res.send({isOk: false})
            return;
            
        }

    } else if (query.email) {
        const users = await UserModel.find({email: query.email}).exec();
        if (users.length > 0) {
            res.send({isOk: false})
            return;
        }
    }
    res.send({isOk: true});
})

router.get('/user/email', async (req, res) => {
    console.log('validate user email except id')
    const {email, id} = req.query;

    const users = await UserModel.find({email, _id: {$ne: id}}).exec();

    if (users.length > 0) {
        res.send({isOk: false})
        return;
    }

    res.send({isOk: true});
})

module.exports = router;