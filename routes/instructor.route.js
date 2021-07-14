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

router.get('/', async (req, res) => {
    console.log('instructor detail')
    const criteria = req.params;
    const instructors = await InstructorModel.find(criteria).where("roleId").eq(UserRole.Instructor).exec();
    res.send(instructors);
})

router.get('/:id', async (req, res) => {
    const instructor = await InstructorModel.findOne({_id: req.params.id}).exec();
    res.send(instructor);
})

router.get('/user/:userId', async (req, res) => {
    console.log('get instructor by userId', req.params);
    const instructor = await InstructorModel.findOne({userId: req.params.userId}).exec();
    console.log(instructor);
    res.send(instructor);
})

router.put('/:id', async (req, res) => {
    console.log('instructor detail')
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

router.put('/update-basic-info', async (req, res) => {
    const user = req.body
    user.id = res.locals.user.id;
    // validate if necessary
    const updatedUser = await UserService.updateBasicInfo(user).then(r => console.log('update user basic info successfully', r));
    res.locals.user = updatedUser;

    res.json(updatedUser);
})

router.post('/update-avatar', upload.single('avatar'), async (req, res) => {
    const file = req.file;
    if (!file) {
        res.redirect('/user/me')
    }
    console.log(file)
    const oldPath = res.locals.user.image;
    const user = await UserService.updateBasicInfo({
        id: res.locals.user.id,
        image: 'assets/images/users/' + file.filename
    })
        .then(r => console.log('update avatar', r));
    res.locals.user = user;
    fs.rmSync(`public/` + oldPath, {
        force: true,
    });
    res.status(200).send({
        message: "success"
    })
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

router.put('/info', async (req, res) => {
    const {id, brief} = req.body
    try {
        const instructor = await InstructorModel.findOne({_id: id}).exec()
        if (!instructor) {
            res.status(400).send({
                message: 'Instructor not found'
            })
            return;
        }

        const updateResult = await instructor.update({brief}, {upsert: true}).exec();
        res.send(updateResult)
    } catch (err) {
        res.status(400).send({
            message: err.message
        })
    }

})

module.exports = router;