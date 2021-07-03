const express = require('express')
const CategoryService = require('../services/category.service')
const CategoryModel = require("../schemas/category.schema");
const ValidationError = require('mongoose/lib/error/validation');
const router = express.Router();

router.get('/', async (req, res) => {
    const query = req.query
    console.log(query);
    const r = await CategoryModel.find({level: 1, ...query})
        .populate('subs')
        .exec();

    res.send(r)
})

router.get('/:id', async (req, res) => {
    console.log(req.params.id);
    res.send(await CategoryModel.findById(req.params.id).exec())
})


module.exports = router;