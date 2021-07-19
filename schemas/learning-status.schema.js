let mongoose = require('mongoose');
const {Schema} = mongoose
const mongoJson = require('@meanie/mongoose-to-json')

const learningStatus = new Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'course',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'user',
        required: true
    },
    video: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Course_Chapter_Video',
    },
    playedSeconds: {
        type: Number,
        default: 0,
    },
    chapterIndex: {
        type: Number,
        default: 0,
    },
}, {timestamps: true}).plugin(mongoJson)

const LearningStatusModel = mongoose.model('learning_status', learningStatus);
module.exports = LearningStatusModel;