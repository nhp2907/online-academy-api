const ValidationError = require('mongoose/lib/error/validation');

const router = require('express').Router()
const Course = require('../schemas/course.schema')

router.get('/', async (req, res) => {
    const criteria = req.query
    console.log(criteria);
    const course = await Course.find(criteria).exec();
    console.log('course', course);
    res.send(course)
})

router.get('/search', async (req, res) => {
    const criteria = req.query
    const courses = await Course.find(criteria).exec();
    res.send(courses)
})

router.post('/', async (req, res) => {
    try {
        const course = await Course.create(req.body);
        res.send(course)
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

module.exports = router;