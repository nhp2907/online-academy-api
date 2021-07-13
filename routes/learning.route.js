const express = require('express')
const CategoryService = require('../services/category.service')
const CategoryModel = require("../schemas/category.schema");
const ValidationError = require('mongoose/lib/error/validation');
const CourseVideoModel = require("../schemas/course-video.schema");
const router = express.Router();

router.get('/last-play-video', async (req, res) => {
    const {userId, courseId} = req.query;
    const videos = await CourseVideoModel.find({courseId: courseId}).limit(1).exec();

    if (videos.length > 0) {
        res.send(videos[0])
    } else {
        res.status(400).send({
            message: "No video found"
        })
    }
})

module.exports =  router;