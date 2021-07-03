const ValidationError = require('mongoose/lib/error/validation');
const multer = require("multer");
const router = require('express').Router()
const CourseModel = require('../schemas/course.schema')
const UserModel = require("../schemas/user.schema");
const UserRole = require("../constant/UserRole");
const CourseChapterModel = require("../schemas/course-chapter.schema");
const fs = require('fs');
const CourseVideoModel = require("../schemas/course-video.schema");
const {apiUrl} = require("../constant/configs");
const {PROJECT_DIR} = require("../setting");

const COURSE_IMAGE_PATH = "public/course/image";
const COURSE_VIDEO_PATH = "data/course/video";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, COURSE_IMAGE_PATH)
    },
    filename: function (req, file, cb) {
        let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
        cb(null, Date.now() + '' + ext)
    }
})

const videoStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, COURSE_VIDEO_PATH)
    },
    filename: function (req, file, cb) {
        let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
        cb(null, Date.now() + '' + ext)
    }
})
const uploadCourseImage = multer({storage})
const uploadCourseVideo = multer({storage: videoStorage})

router.get('/', async (req, res) => {
    const criteria = req.query
    console.log(criteria);
    const course = await CourseModel.find(criteria).exec();
    console.log('courses', course);
    res.send(course)
})

router.get('/:id', async (req, res) => {
    const id = req.params.id
    const course = await CourseModel.findOne({_id: id}).exec();

    console.log('course by id', course);
    res.send(course)
})

router.get('/search', async (req, res) => {
    const criteria = req.query
    const courses = await CourseModel.find(criteria).exec();
    res.send(courses)
})

// create course
router.post('/', async (req, res) => {
    try {
        const dto = req.body;
        console.log('create course dto: ', dto);
        // check instructor
        const instructor = UserModel.findOne({_id: dto.instructorId, roleId: UserRole.Instructor})
        if (!instructor) {
            res.status(400).send({
                message: "Instructor not found!"
            })
        }

        const course = await CourseModel.create(dto);
        console.log('create course result: ', course);
        res.send(course)
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

// update course
router.put('/', async (req, res) => {
    try {
        const dto = req.body;
        console.log('update course dto: ', dto);
        // check instructor
        const instructor = UserModel.findOne({_id: dto.instructorId, roleId: UserRole.Instructor})
        if (!instructor) {
            res.status(400).send({
                message: "Instructor not found!"
            })
        }

        const course = await CourseModel.updateOne({_id: dto.id}, dto);
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

// upload image only
router.post('/:id/image', uploadCourseImage.single('image'), async (req, res) => {
    const file = req.file;
    if (!file) {
        res.status(400).send({
            message: 'Cover not found!'
        })
        return;
    }
    try {
        const courseId = req.params.id;
        const course = await CourseModel.findOne({_id: courseId}).exec();
        const oldImage = course.image;
        const newImagePath = apiUrl + file.path.replace('public', '');
        const updateResult = await CourseModel.updateOne({_id: courseId}, {image: newImagePath});
        res.send(updateResult)
        if (oldImage) {
            fs.rmSync('public/' + oldImage, {
                force: true
            })
        }
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

router.get('/:id/image', async (req, res) => {
    const course = await CourseModel.findById(req.params.id).exec();
    res.sendFile(PROJECT_DIR + course.image);
})

//region Course Chapter

// create new chapter
router.post('/:courseId/chapter', async (req, res) => {
    const courseId = req.params.courseId;
    const chapter = req.body;
    chapter.courseId = courseId;
    try {
        const newChapter = CourseChapterModel.create(chapter);
        res.send(newChapter);
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

// update chapter
router.put('/:courseId/chapter', async (req, res) => {
    const chapter = req.body;
    try {
        const newChapter = await CourseChapterModel.updateOne({_id: chapter.id}, chapter).exec();
        res.send(newChapter);
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

// get course chapter
router.get('/:courseId/chapter', async (req, res) => {
    const chapters = await CourseChapterModel.find({courseId: req.params.courseId}).exec();
    res.send(chapters);
})

// delete chapter
router.delete('/:courseId/chapter/:chapterId', async (req, res) => {
    const chapterId = req.params.chapterId;
    try {
        const newChapter = await CourseChapterModel.deleteOne({_id: chapterId}).exec();
        res.send(newChapter);
    } catch (err) {
        res.status(400).send({
            code: 400,
            message: err.message
        })
    }
})
//endregion

//region Course Chapter Video

// create new video
router.get('/:courseId/chapter/:chapterId/video', async (req, res) => {
    const videos = await CourseVideoModel.find({courseId: req.params.courseId, chapterId: req.params.chapterId}).exec();
    res.send(videos)
})

router.post('/:courseId/chapter/:chapterId/video', uploadCourseVideo.single('file'), async (req, res) => {
    const file = req.file;
    console.log(
        file
    )
    if (!file) {
        res.status(400).send({
            message: 'Video not found!'
        })
        return;
    }

    const courseId = req.params.courseId;
    const video = req.body;
    video.courseId = courseId;
    video.chapter = courseId;
    video.videoUrl = file.path;
    try {
        const newChapter = await CourseVideoModel.create(video);
        res.send(newChapter);
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

// update video
router.put('/:courseId/chapter/:chapterId/video', async (req, res) => {
    const chapter = req.body;
    try {
        const newChapter = CourseChapterModel.updateOne({_id: chapter.id}, chapter);
        res.send(newChapter);
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

//endregion

module.exports = router;