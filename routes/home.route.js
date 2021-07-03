const express = require('express')
const UserService = require("../services/user.service");
const router = express.Router();

const multer = require('multer')
const UserModel = require("../schemas/user.schema");
const UserRole = require("../constant/UserRole");
const CourseModel = require("../schemas/course.schema");

router.get('/top-course', async (req, res) => {
    const query = req.query;
    const courses = await CourseModel.find({}).sort({updatedAt: -1, rating: -1}).limit(query.count || 3).exec();
    res.send(courses)
})

router.get('/most-view-course', async (req, res) => {
    const query = req.query;
    const courses = await CourseModel.find().sort({updatedAt: -1, views: -1}).limit(query.count || 10).exec();
    res.send(courses)
})

router.get('/latest-course', async (req, res) => {
    const query = req.query;
    const courses = await CourseModel.find().sort({updatedAt: -1}).limit(query.count || 10).exec();
    res.send(courses)
})


module.exports = router