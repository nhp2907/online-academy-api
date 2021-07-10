const fs = require('fs');
const express = require('express')
const UserService = require("../services/user.service");
const router = express.Router();

const multer = require('multer')
const UserModel = require("../schemas/user.schema");
const UserRole = require("../constant/UserRole");
const InstructorModel = require("../schemas/instructor.schema");
const USER_IMAGE_PATH = "public/assets/images/users/";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, USER_IMAGE_PATH)
    },
    filename: function (req, file, cb) {
        let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
        cb(null, Date.now() + ext)
    }
})
const upload = multer({storage: storage});

router.get('/:id', async (req, res) => {
    const instructor = await InstructorModel.findOne({_id: req.params.id}).exec();
    res.send(instructor);
})

router.get('/:id/detail', async (req, res) => {
    const instructor = await InstructorModel.findOne({_id: req.params.id}).exec();
    const user = await UserModel.findOne({_id: instructor.userId, deleted: {$ne: true}}).exec();
    if (!user) {
        res.status(400).send({
            message: 'User not found'
        })
        return;
    }
    if (!user.status) {
        res.status(400).send({
            message: 'Account is disabled'
        })
        return;
    }

    const detail = {...user.toJSON(), ...instructor.toJSON(), id: instructor.toJSON().id};
    console.log(detail);
    res.send(detail);
})

router.get('/user/:userId', async (req, res) => {
    console.log('instructor by userId', req.params);
    const instructor = await InstructorModel.findOne({userId: req.params.userId}).exec();
    console.log(instructor);
    res.send(instructor);
})

module.exports = router;