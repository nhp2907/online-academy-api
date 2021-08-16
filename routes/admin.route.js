const ValidationError = require('mongoose/lib/error/validation');

const express = require('express')
const UserService = require("../services/user.service");
const router = express.Router();

const UserModel = require("../schemas/user.schema");
const UserRole = require("../constant/UserRole");
const CategoryModel = require("../schemas/category.schema");
const CourseModel = require("../schemas/course.schema");
const CategoryService = require('../services/category.service')
const InstructorModel = require("../schemas/instructor.schema");
const {signup} = require("../services/auth.service");

//region User
router.get('/user', async (req, res) => {
    const criteria = req.params;
    const users = await UserModel.find(criteria).where("roleId").ne(UserRole.Admin)
        .where('deleted').ne(true)
        .exec();
    res.send(users);
})

router.get('/instructor', async (req, res) => {
    const criteria = req.params;
    const users = await UserModel.find(criteria).where({roleId: UserRole.Instructor})
        .where('deleted').ne(true)
        .exec();
    res.send(users);
})

router.get('/student', async (req, res) => {
    const criteria = req.params;
    const users = await UserModel.find(criteria).where({roleId: UserRole.Student})
        .where('deleted').ne(true)
        .exec();
    res.send(users);
})

// create for instructor only
router.post('/user', async (req, res) => {
    const body = req.body;
    try {
        body.password = body.password || `${body.username}148nac`;
        body.roleId = UserRole.Instructor;
        body.role = 'Instructor';
        const user = await signup(body);

        if (body.roleId === UserRole.Instructor) {
            try {
                const instructor = await InstructorModel.create({userId: user.id})
            } catch (err) {
                await UserModel.deleteOne({_id: user.id}).exec();
                res.status(500).send({
                    message: 'Something broken!'
                })
                return;
            }
        }

        res.send(user);
    } catch (err) {
        if (err instanceof ValidationError) {
            console.log('create course error: ', err);
            res.status(400).send({
                code: 400,
                message: err.message
            })
        } else {
            res.status(400).send({
                message: err.message
            })
        }
    }

})

router.put('/user', async (req, res) => {
    const updateUser = req.body;
    console.log(updateUser);
    try {
        await UserModel.updateOne({_id: updateUser.id}, updateUser, {upsert: true});
        res.send(updateUser);
    } catch (err) {
        res.status(400).send({
            message: err.message
        })
    }
})

router.delete('/user/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        await UserModel.updateOne({_id: userId}, {deleted: true});
        res.send({message: 'Ok'});
    } catch (err) {
        res.status(400).send({
            message: err.message
        })
    }
})
//endregion

//region Category
router.get('/category', async (req, res) => {
    const query = req.query
    if (query.name) {
        query.uniqueName = query.name.toLowerCase();
        delete query.name
    }
    console.log(query);
    const r = await CategoryModel.find({...query})
        .populate('subs')
        .exec();

    res.send(r)
})

router.post('/category', async (req, res) => {
    try {
        const newCate = await CategoryService.createCate(req.body);
        res.send(newCate)
    } catch (err) {
        res.status(400).send({
            message: err.message
        })
    }
})

router.put('/category', async (req, res) => {
    const cate = req.body;
    try {
        delete cate.subs
        cate.uniqueName = cate.name.toLowerCase();
        let newVar = await CategoryModel.updateOne({_id: cate.id}, cate, {upsert: true});
        console.log('updater esult: ', newVar);
        res.send(await CategoryModel.findById(cate.id));
    } catch (err) {
        res.status(400).send({
            message: err.message
        })
    }
})

router.delete('/category/:id', async (req, res) => {
    const cateId = req.params.id;
    const courses = await CourseModel.find({$or: [{categoryId: cateId}, {subCategoryId: cateId}]}).exec()
    if (courses.length > 0) {
        res.status(400).send({
            message: 'Can not delete referenced category'
        })
        return;
    }
    const cates = await CategoryModel.findById(cateId).populate('subs').exec();
    try {
        await CategoryModel.deleteOne({_id: cateId}).exec();
        res.send({
            message: 'Ok'
        });
    } catch (err) {
        res.status(400).send({
            message: err.message
        })
    }
})
//endregion

//region Course

router.get('/course', async (req, res) => {
    const criteria = req.query
    if (criteria.categoryName) {
        const cate = await CategoryModel.findOne({uniqueName: criteria.categoryName.toLowerCase()}).exec();
        delete criteria.categoryName
        criteria.categoryId = cate._id
    }
    const course = await CourseModel.find(criteria)
        .where('deleted').ne(true)
        .exec();

    course.map(c => c.toJSON())
        .map(c => {
            console.log(c.updatedAt);
        })
    res.send(course)
})

router.post('/disabled-course', async (req, res) => {
    const {courseId} = req.body;
    try {
        const course = await CourseModel.findOne({_id: courseId}).exec();

        if (!course) {
            res.status(400).send({message: 'Course not found'});
        }

        course.disabled = !course.disabled;

        const updateResult = await course.save({validateModifiedOnly: true});
        res.send(updateResult);
    } catch (err) {
        res.status(400).send({message: err.message})
    }
})

router.delete('/course/:courseId', async (req, res) => {
    const {courseId} = req.params;
    try {
        const course = await CourseModel.findOne({_id: courseId}).exec();

        if (!course) {
            res.status(400).send({message: 'Course not found'});
        }

        course.deleted = true;

        const updateResult = await course.save({validateModifiedOnly: true});
        res.send(updateResult);
    } catch (err) {
        res.status(400).send({message: err.message})
    }
})
//endregion

module.exports = router;