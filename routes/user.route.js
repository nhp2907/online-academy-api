const {currentEnvName} = require("../configs/evironment");

const fs = require('fs');
const ValidationError = require('mongoose/lib/error/validation');

const express = require('express')
const UserService = require("../services/user.service");
const router = express.Router();

const multer = require('multer')
const UserModel = require("../schemas/user.schema");
const UserRole = require("../constant/UserRole");
const CourseModel = require("../schemas/course.schema");
const InvoiceModel = require("../schemas/invoice.schema");
const {PROJECT_DIR} = require("../setting");
const {currentEnv} = require('../configs/evironment')
const USER_IMAGE_PATH = PROJECT_DIR + '/' + "public/user/image";

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
    console.log('update user info')
    const updateUser = req.body;
    const {id, email} = updateUser;

    if (id != res.locals.user.id) {
        res.status(401).send({
            message: `Unauthorized`
        })
        return;
    }

    if (email) {
        const user = await UserModel.findOne({email}).exec();
        if (user && user.id !== id) {
            res.status(400).send({
                message: `Email ${email} already taken`
            })
            return;
        }
    }

    delete updateUser.roleId;
    delete updateUser.role;
    delete updateUser.username; // username is not readonly
    try {
        const updateResult = await UserModel.updateOne({_id: updateUser.id}, updateUser, {upsert: true}).exec();
        res.send(updateResult);
    } catch (err) {
        res.status(400).send({
            message: err.message
        })
    }
})

router.post('/:id/image', upload.single('image'), async (req, res) => {
    const file = req.file;
    console.log('upload file', file);
    if (!file) {
        res.status(400).send({
            message: 'Image not found!'
        })
        return;
    }
    try {
        const userId = req.params.id;
        const user = await UserModel.findOne({_id: userId, deleted: {$ne: true}}).exec();
        if (!user) {
            res.status(400).send({
                message: 'User not found'
            })
            return;
        }
        const oldImagePath = user.imagePath;
        let newImageUrl;
        if (currentEnvName === 'production') {
            newImageUrl = currentEnv.apiUrl + '/user/image' + file.name || file.filename;
            console.log('new Image url', newImageUrl)
        } else {
            newImageUrl = currentEnv.apiUrl + file.path.replace('public', '').split("\\").join("/");
        }
        const updateResult = await UserModel.updateOne(
            {_id: userId},
            {image: newImageUrl, imagePath: file.path}, {upsert: true});

        res.send(updateResult)
        if (oldImagePath) {
            console.log('remove file path: ', oldImagePath)
            fs.rmSync(oldImagePath, {
                force: true
            })
        }
    } catch (err) {
        res.status(400).send({
            code: 400,
            message: err.message
        })
    }
})

router.post('/:id/change-password', async (req, res) => {
    const {oldPassword, newPassword} = req.body
    console.log(req.body);
    try {
        const updateResult = await UserService.updatePassword(req.params.id, oldPassword, newPassword);
        res.send(updateResult)
    } catch (err) {
        res.status(400).send({
            message: err.message
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

router.get('/:id/my-learning-list', async (req, res) => {
    const me = await UserModel.findById(req.params.id)
    if (me.id !== res.locals.user.id) {
        res.status(400).send({
            message: 'Unauthorized'
        })
        return;
    }

    try {
        const courses = await CourseModel.find({_id: {$in: me.myLearningList}});
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

router.post('/buy-course', async (req, res) => {
    const dto = req.body;

    const authUser = res.locals.user
    try {
        const user = await UserModel.findById(authUser.id).exec();
        if (!user) {
            res.status(400).send({
                message: "User not found!"
            })
            return;
        }

        const course = await CourseModel.findOne({_id: dto.courseId}).exec();

        if (!course) {
            res.status(400).send({
                message: "Course not found!"
            })
            return;
        }

        dto.price = course.price;
        const invoice = await InvoiceModel.create(dto);

        user.myLearningList.push(dto.courseId)
        await user.save();

        course.numStudentEnroll = course.numStudentEnroll + 1;
        await course.save();

        res.send(invoice);
    } catch (err) {
        res.status(400).send({
            message: err.message
        })
    }
})


module.exports = router;