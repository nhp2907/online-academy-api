let mongoose = require('mongoose');
const {Schema} = mongoose
const mongoJson = require('@meanie/mongoose-to-json')
const courseChapter = new Schema({
    courseId:  {
        type: mongoose.Schema.Types.ObjectId, ref: 'Course',
        required: true
    },
    name: String
}, {timestamps: true}).plugin(mongoJson)

const CourseChapterModel = mongoose.model('CourseChapter', courseChapter);
module.exports = CourseChapterModel;