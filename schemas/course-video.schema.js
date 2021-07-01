let mongoose = require('mongoose');
const {Schema} = mongoose
const mongoJson = require('@meanie/mongoose-to-json')

const courseVideo = new Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Course',
        required: true
    },
    chapterId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'CourseChapter',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    videoUrl: {
        type: String,
        required: true
    },
}, {timestamps: true}).plugin(mongoJson)

const CourseVideoModel = mongoose.model('Course_Chapter_Video', courseVideo);
module.exports = CourseVideoModel;