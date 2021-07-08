const fs = require('fs');
const ValidationError = require('mongoose/lib/error/validation');

const express = require('express')
const UserService = require("../services/user.service");
const router = express.Router();

const multer = require('multer')
const UserModel = require("../schemas/user.schema");
const UserRole = require("../constant/UserRole");
const CourseModel = require("../schemas/course.schema");
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

router.get('/me', async (req, res) => {
    res.send(res.locals.user);
})

router.post('/', async (req, res) => {
    const body = req.body;
    try {
        const newUser = await UserModel.create(body);
        res.send(newUser);
    } catch (err) {
        if (err instanceof ValidationError) {
            console.log('create course error: ', err);
            res.status(400).send({
                code: 400,
                message: err.message
            })
        } else {
            throw err;
        }
    }

})

router.put('/', async (req, res) => {
    const updateUser = req.body;
    delete updateUser.roleId;
    delete updateUser.role;
    try {
        await UserModel.updateOne({_id: updateUser.id}, updateUser, {upsert: true});
        res.send(updateUser);
    } catch (err) {
        res.status(400).send({
            message: err.message
        })
    }
})

router.post('/update-avatar', upload.single('avatar'), async (req, res) => {

})

router.post('/update-password', async (req, res) => {
    const {oldPassword, newPassword} = req.body
    console.log(req.body);
    // validate if need
    const token = await UserService.updatePassword(res.locals.user.id, oldPassword, newPassword);
    console.log('update password new token: ', token);
    if (token != null) {
        res.send({
            message: 'success'
        })
    } else {
        res.status(401).send({
            message: "Incorrect password"
        })
    }
})

router.get('/:id/watch-list', async (req, res) => {
    const me = await UserModel.findById(req.params.id)
    try {
        const courses = await CourseModel.find({_id: {$in: me.watchList}});
        res.send(courses)
    } catch (err) {
        res.status(400).send({
            message: err.message
        })
    }
})

router.post('/:id/watch-list', async (req, res) => {
    const body = req.body;
    try {
        const user = await UserModel.findById(req.params.id).exec();
        if (user.watchList.includes(body.courseId)) {
            res.status(400).send({
                message: 'This course already in watch list!'
            })
        }
        user.watchList.push(body.courseId);
        const saveResult = await user.save();
        res.send(saveResult)
    } catch (err) {
        res.status(400).send({
            message: err.message
        })
    }
})

router.delete('/:id/watch-list/:courseId', async (req, res) => {
    const courseId = req.params.courseId;
    try {
        const user = await UserModel.findById(req.params.id).exec();
        const index = user.watchList.findIndex(cid => cid !== courseId)

        if (index === -1) {
            res.status(400).send({message: 'Course not found in Watch list'});
            return;
        }

        user.watchList.splice(index, 1);
        const saveResult = await user.save();
        res.send(saveResult)
    } catch (err) {
        res.status(400).send({
            message: err.message
        })
    }
})

module.exports = router;