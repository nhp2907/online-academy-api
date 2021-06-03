const express = require('express')
const CategoryService = require('../services/category.service')
const CategoryModel = require("../schemas/category.schema");
const ValidationError = require('mongoose/lib/error/validation');
const router = express.Router();

router.get('/', async (req, res) => {
    const r = await CategoryModel.find({level: 1})
        .populate('subs')
        .exec();

    res.send(r)
})

router.get('/:id', async (req, res) => {
    console.log(req.params.id);
    res.send(await CategoryModel.findById(req.params.id).exec())
})

router.put('/', async (req, res) => {
    const cate = req.body;
    let newVar = await CategoryModel.updateOne({_id: cate.id}, cate, {upsert: true});
    console.log('updater esult: ', newVar);
    res.send(await CategoryModel.findById(cate.id));
})

router.post('/', async (req, res) => {
    const sameNameCate = await CategoryModel.find({name: cate.name}).exec();
    if (sameNameCate.length > 0) {
        res.status(400).send({
            message: `Category name ${cate.name} already exist`
        })
        return;
    }
    const cate = req.body;
    if (cate.level == 2) {
        if (!cate.parentId) {
            res.status(400).send({
                message: "Sub category must belong to one parent!"
            })
        }
    }
    try {
        const newCategory = await CategoryModel.create(req.body);
        if (cate.level == 2) {
            const parent = await CategoryModel.findById(cate.parentId);
            if (parent.subs) {
                parent.subs.push(newCategory._id);
                console.log('parent.subs not false', parent.subs);
            } else {
                parent.subs = [newCategory._id]
                console.log('parent.subs', parent.subs);
            }
            const updateResult = await CategoryModel.findByIdAndUpdate(parent._id, parent);
            console.log('updateParentResult: ', updateResult);
        }
        res.send(newCategory)
    } catch (err) {
        if (err instanceof ValidationError) {
            res.status(400).send({
                code: 400,
                message: err.message
            })
        } else {
            throw err;
        }
    }
})


router.delete('/:id', async (req, res) => {
    // const id = req.params.id;
    // await CategoryService.
    // todo: check sub cate on this.
    res.status(403).send({
        message: "Action is not supported"
    })
})

router.delete('/:id/:subId', async (req, res) => {

})

module.exports = router;