const ValidationError = require('mongoose/lib/error/validation');

const router = require('express').Router()
const Course = require('../schemas/course.schema')
const UserModel = require("../schemas/user.schema");
const UserRole = require("../constant/UserRole");

router.get('/', async (req, res) => {
    const criteria = req.query
    console.log(criteria);
    const course = await Course.find(criteria).exec();
    console.log('courses', course);
    res.send(course)
})

router.get('/:id', async (req, res) => {
    const id = req.params.id
    const course = await Course.findOne({_id: id}).exec();

    console.log('course', course);
    res.send(course)
})

router.get('/search', async (req, res) => {
    const criteria = req.query
    const courses = await Course.find(criteria).exec();
    res.send(courses)
})

// create course
router.post('/', async (req, res) => {
    try {
        const dto = req.body;
        console.log('dto: ', dto);
        // check instructor
        const instructor = UserModel.findOne({_id: dto.instructorId, roleId: UserRole.Instructor})
        if (!instructor) {
            res.status(400).send({
                message: "Instructor not found!"
            })
        }

        const course = await Course.create(dto);
        console.log(course);
        res.send(course)
    } catch (err) {
        if (err instanceof ValidationError) {
            console.log(err);
            res.status(400).send({
                code: 400,
                message: err.message
            })
        } else {
            throw err;
        }
    }
})

router.post('/:id/image', async (req, res) => {
    try {
        const courseId = req.params.id;
        console.log(courseId)
        const courses = await Course.find({}).exec();
        const oldCourse = courses[0];
        console.log('course body: ', req.body);
        // const course = await Course.create(req.body);
        res.send({})
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