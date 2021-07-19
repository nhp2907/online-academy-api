const express = require('express')
const CategoryService = require('../services/category.service')
const CategoryModel = require("../schemas/category.schema");
const ValidationError = require('mongoose/lib/error/validation');
const router = express.Router();

router.get('/', async (req, res) => {
    const query = req.query
    console.log(query);
    const r = await CategoryModel.find({level: 1, ...query})
        .where("deleted").ne(true)
        .populate('subs')
        .exec();

    // const categories = await CategoryModel.aggregate([
    //     {
    //         $match: {
    //             level: 1,
    //             deleted: {$ne: true}
    //         }
    //     }, {
    //         $lookup: {
    //             from: "categories",
    //             let: {parentId: "$_id"},
    //             pipeline: [{
    //                 $match: {
    //                     parentId: "$$parentId"
    //                 }
    //             }],
    //             as: "subs"
    //         }
    //     }
    // ]).exec();

    res.send(r)
})

router.get('/top-most-register', async (req, res) => {
    const list = await CategoryModel.aggregate([
        {
            $match: {
                deleted: {$ne: true}
            }
        },
        {
            $lookup: {
                from: 'courses',
                localField: '_id',
                foreignField: 'categoryId',
                as: 'courses'
            }
        }, {
            $project: {
                courseCount: {$size: '$courses'},
                name: 1,
            }
        }
    ]).limit(5).sort({courseCount: -1}).exec();
    console.log('list', list);
    res.send(list);
})

router.get('/:id', async (req, res) => {
    console.log(req.params.id);
    res.send(await CategoryModel.findById(req.params.id).exec())
})


module.exports = router;