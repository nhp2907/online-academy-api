const express = require('express')
const CategoryService = require('../services/category.service')
const router = express.Router();

router.get('/', async (req, res) => {
    res.send(await CategoryService.getAllCategories())
})

router.get('/:id',  async (req, res) => {
    res.send(CategoryService.getCategoryById(req.params.id))
})

router.post('/',  async (req, res) => {
    const cate = req.body;
    cate.status = 1;
    res.send(await CategoryService.createNewCategory(cate))
})


router.delete('/:id', async (req, res) => {
    // const id = req.params.id;
    // await CategoryService.
    res.status(403).send({
        message: "Action is not supported"
    })
})

module.exports = router;