let mongoose = require('mongoose');
const {Schema} = mongoose
const mongoJson = require('@meanie/mongoose-to-json')
const courseReview = new Schema({
    courseId:  {
        type: mongoose.Schema.Types.ObjectId, ref: 'Course',
        required: true
    },
    userId:  {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        max: 5,
        min: 0,
    },
    content: {
        type: String,
        required: true,
        minLength: 1
    },
}, {timestamps: true}).plugin(mongoJson)

const CourseReviewModel = mongoose.model('CourseChapter', courseReview);
module.exports = CourseReviewModel;