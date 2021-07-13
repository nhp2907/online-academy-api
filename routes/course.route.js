const ValidationError = require('mongoose/lib/error/validation');
const multer = require("multer");
const router = require('express').Router()
const CourseModel = require('../schemas/course.schema')
const UserModel = require("../schemas/user.schema");
const UserRole = require("../constant/UserRole");
const CourseChapterModel = require("../schemas/course-chapter.schema");
const fs = require('fs');
const CourseVideoModel = require("../schemas/course-video.schema");
const CategoryModel = require("../schemas/category.schema");
const InstructorModel = require("../schemas/instructor.schema");
const CourseReviewModel = require("../schemas/course-review.schema");
const InvoiceModel = require("../schemas/invoice.schema");
const {verifyJwt} = require("../middleware/user.middleware");
const {verifyInstructor} = require("../middleware/user.middleware");
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
    if (criteria.categoryName) {
        const cate = await CategoryModel.findOne({uniqueName: criteria.categoryName.toLowerCase()}).exec();
        delete criteria.categoryName
        criteria.categoryId = cate._id
    }
    const course = await CourseModel.find(criteria).exec();
    console.log('courses', course);
    res.send(course)
})

router.get('/search', async (req, res) => {
    const kw = req.query.kw;
    console.log(kw);
    const result = [];
    const cate = await CategoryModel.findOne({uniqueName: kw.toLowerCase()}).exec();

    if (cate) {
        const coursesByCate = await CourseModel.find({categoryId: cate.id}).exec();
        result.push(...coursesByCate);
    }

    const coursesSearch = await CourseModel.find({$text: {$search: kw}}).exec();
    result.push(...coursesSearch);
    console.log(result.length);

    res.send(result)
})

router.get('/:id', async (req, res) => {
    const id = req.params.id
    const course = await CourseModel.findOne({_id: id}).exec();
    res.send(course)
})

router.get('/search', async (req, res) => {
    const criteria = req.query
    const courses = await CourseModel.find(criteria).exec();
    res.send(courses)
})

router.get('/:id/related', async (req, res) => {
    console.log('related')
    const course = await CourseModel.findById(req.params.id).exec();
    const relatedCourse = await CourseModel.find({categoryId: course.categoryId})
        .sort({createdAt: -1})
        .limit(5)
        .exec();

    res.send(relatedCourse)
})

// create course
router.post('/', verifyJwt, verifyInstructor, async (req, res) => {
    try {
        const dto = req.body;
        console.log('create course dto: ', dto);
        // check instructor
        const instructor = await InstructorModel.findOne({_id: dto.instructorId})
        if (!instructor) {
            res.status(400).send({
                message: "Instructor not found!"
            })
        }
        const user = await UserModel.findOne({_id: instructor.userId, deleted: {$ne: true}}).exec();
        dto.author = `${user.firstName} ${user.lastName}`

        // check category
        const cate = await CategoryModel.findOne({_id: dto.categoryId}).exec();
        if (!cate) {
            res.status(400).send({
                message: "Category not found"
            })
        }
        dto.categoryName = cate.name;

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
router.put('/', verifyJwt, verifyInstructor, async (req, res) => {
    try {
        const dto = req.body;
        console.log('update course dto: ', dto);
        const findCourse = await CourseModel.findOne({_id: dto.id}).exec();
        if (!findCourse) {
            res.status(400).send({
                message: "Course not found!"
            })
            return;
        }

        // if (findCourse.published) {
        //     res.status(400).send({
        //         message: "Can not edit published course!"
        //     })
        //     return;
        // }

        // check instructor
        const instructor = UserModel.findOne({_id: dto.instructorId, roleId: UserRole.Instructor, deleted: {$ne: true}})
        if (!instructor) {
            res.status(400).send({
                message: "Instructor not found!"
            })
        }

        const updateResult = await CourseModel.updateOne({_id: dto.id}, dto);
        res.send(updateResult)
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
router.post('/:id/image', verifyJwt, verifyInstructor, uploadCourseImage.single('image'), async (req, res) => {
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
router.post('/:courseId/chapter', verifyJwt, verifyInstructor, async (req, res) => {
    const courseId = req.params.courseId;
    const chapter = req.body;
    chapter.courseId = courseId;
    try {
        const newChapter = await CourseChapterModel.create(chapter);
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
            co
        }
    }
})

// update chapter
router.put('/:courseId/chapter', verifyJwt, verifyInstructor, async (req, res) => {
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
router.delete('/:courseId/chapter/:chapterId', verifyJwt, verifyInstructor, async (req, res) => {
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

router.get('/:courseId/chapter/:chapterId/video/:videoId/stream', async (req, res) => {
    // todo: check course belong to user
    const {videoId, courseId} = req.params
    const invoice = InvoiceModel.find({userId: res.locals.user, courseId}).exec();
    if (!invoice) {
        res.status(400).send({message: 'Invoice not found'});
        return;
    }

    const video = await CourseVideoModel.findOne({_id: videoId}).exec();
    res.sendFile(PROJECT_DIR + '\\' + video.videoUrl, {}, (a) => {

    })
})

router.post('/:courseId/chapter/:chapterId/video', verifyJwt, verifyInstructor, uploadCourseVideo.single('file'), async (req, res) => {
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
router.put('/:courseId/chapter/:chapterId/video', verifyJwt, verifyInstructor, async (req, res) => {
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

router.delete('/:courseId/chapter/:chapterId/video/:videoId', verifyJwt, verifyInstructor, async (req, res) => {
    try {
        const deleteRes = await CourseVideoModel.deleteOne({_id: req.params.videoId}).exec()
        res.send(deleteRes);
    } catch (err) {
        res.status(400).send({message: err.message})
    }
})

//endregion

//region Reviews
router.get('/:courseId/review', async (req, res) => {
    const query = req.query;
    const limit = parseInt(query.limit);
    delete query.limit
    console.log(query);
    try {
        const reviews = await CourseReviewModel.find({...query, courseId: req.params.courseId})
            .populate('userId')
            .sort({createdAt: -1})
            .limit(limit || 10).exec();
        const result = reviews.map(r => r.toJSON()).map(r => ({
            ...r,
            userName: `${r.userId.firstName} ${r.userId.lastName}`,
            userFirstName: r.userId.firstName,
            userLastName: r.userId.lastName,
            userImage: r.userId.image,
            userId: r.userId.id
        }))
        res.send(result)
    } catch (err) {
        res.status(400).send({message: err.message})
    }
})

router.post('/:courseId/review', async (req, res) => {
    // todo: check own course to review
    const courseId = req.params.courseId
    const review = req.body;
    try {
        const oldNumReviews = await CourseReviewModel.find({courseId}).count().exec();
        const course = await CourseModel.findOne({_id: courseId}).exec();
        const newRating = (course.rating * oldNumReviews + review.rating) / (oldNumReviews + 1);
        CourseModel.updateOne({_id: courseId}, {rating: newRating, numReview: oldNumReviews + 1}).exec().then(r => {
        });

        const newReview = await CourseReviewModel.create(review);
        res.send(newReview);

        // update rating

    } catch (err) {
        console.log(err);
        res.status(400).send(err.message);
    }
})

//endregion

router.get('/:id/feedback', async (req, res) => {
    const id = req.params.id;
    const numReview = await CourseReviewModel.find({courseId: id}).count().exec();
    const arr = [5, 4, 3, 2, 1];
    const promises = arr.map(v => CourseReviewModel.find({courseId: id, rating: v}).count().exec())
    const reviewCount = await Promise.all(promises);
    const percents = reviewCount.map(c => c * 100 / numReview);
    console.log('percent', percents);
    const course = await CourseModel.findOne({_id: id}).exec();
    res.send({
        percents,
        numReview,
        rating: course.rating
    })
})

router.post('/publish', verifyJwt, verifyInstructor, async (req, res) => {
    const {id} = req.body;
    try {
        const course = await CourseModel.findOne({_id: id, deleted: {$ne: true}}).exec()
        if (!course) {
            res.status(400).send({message: 'Course not found'});
            return;
        }

        const courseVideos = await CourseVideoModel.find({courseId: id}).exec();
        if (courseVideos.length === 0) {
            res.status(400).send({message: 'Publish course must have chapters, videos on it'});
            return;
        }
        await CourseModel.updateOne({_id: id}, {published: true});
        res.send({message: 'success'})
    } catch (err) {
        res.status(400).send({message: err.message});
    }
})

router.get('/:id/can-publish', verifyJwt, verifyInstructor, async (req, res) => {
    const {id} = req.params;
    try {
        const course = await CourseModel.findOne({_id: id, deleted: {$ne: true}}).exec()
        if (!course) {
            res.status(400).send({message: 'Course not found'});
            return;
        }

        const courseVideos = await CourseVideoModel.find({courseId: id}).exec();
        if (courseVideos.length === 0) {
            res.send({canPublish: false});
        } else {
            res.send({canPublish: true});
        }
    } catch (err) {
        res.status(400).send({message: err.message});
    }
})

router.put('/:id/plusView', async (req, res) => {
    const {id} = req.params;
    try {
        const course = await CourseModel.findOne({_id: id});
        if (!course) {
            res.status(400).send({message: "Course not found"})
            return;
        }
        const updateResult = await CourseModel.updateOne({_id: id}, {views: course.views + 1})
        res.send(updateResult);
    } catch (err) {
        res.status(400).send({message: err.message})
    }
})

module.exports = router;