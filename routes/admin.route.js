const ValidationError = require('mongoose/lib/error/validation');

const express = require('express')
const UserService = require("../services/user.service");
const router = express.Router();

const UserModel = require("../schemas/user.schema");
const UserRole = require("../constant/UserRole");
const CategoryModel = require("../schemas/category.schema");
const CourseModel = require("../schemas/course.schema");
const CategoryService = require('../services/category.service')

//region User
router.post('/user', async (req, res) => {
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
        await UserModel.updateOne({_id: userId}, {status: false});
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

router.put('/', async (req, res) => {
    const cate = req.body;
    let newVar = await CategoryModel.updateOne({_id: cate.id}, cate, {upsert: true});
    console.log('updater esult: ', newVar);
    res.send(await CategoryModel.findById(cate.id));
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

module.exports = router;