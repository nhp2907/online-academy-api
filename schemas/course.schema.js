let mongoose = require('mongoose');
const {Schema} = mongoose
const mongoJson = require('@meanie/mongoose-to-json')
const courseSchema = new Schema({
    name: String,
    categoryId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Category',
        required: true
    },
    subCategoryId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Category'
    },
    instructorId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true
    },
    headline: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    concurrency: String,
    price: {
        type: Number,
        required: true
    },
    prePrice: Number,
    discount: Number,
    language: String,
    description: {
        type: String,
        required: true
    },
    rating: Number,
    numReview: Number,
    numLecture: Number,
    status: String,
    estimateContentLength: Number,
    numStudentEnroll: Number,
    views: Number
}, {timestamps: true}).plugin(mongoJson)

const CourseModel = mongoose.model('Course', courseSchema);
module.exports = CourseModel;