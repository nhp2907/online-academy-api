const router = require('express').Router()
const Course = require('../schemas/course.schema')

router.get('/', async (req, res) => {
    const course = await Course.find().exec();
    console.log('course', course);
    res.send(course)
})

router.post('/', async (req, res) => {
    const course = await Course.create(req.body);
    console.log('course', course);
    res.send(course)
})

module.exports = router;