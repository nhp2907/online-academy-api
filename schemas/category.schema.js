let mongoose = require('mongoose');
const {Schema} = mongoose
const mongoJson = require('@meanie/mongoose-to-json')
const categorySchema = new Schema({
    name: String,
    headline: String,
    image: String,
    concurrency: String,
    price: Number,
    prePrice: Number,
    discount: Number,
    language: String,
    description: String,
    rating: Number,
    numReview: Number,
    numLecture: Number,
    status: String,
    estimateContentLength: Number,
    numStudentEnroll: Number
}, {timestamps: true}).plugin(mongoJson)

const CourseModel = mongoose.model('Course', courseSchema);
module.exports = CourseModel;