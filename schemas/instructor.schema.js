let mongoose = require('mongoose');
const {Schema} = mongoose
const mongoJson = require('@meanie/mongoose-to-json')
const instructorSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        default: 0
    },
    numReview: {
        type: Number,
        default: 0
    },
    numStudent: {
        type: Number,
        default: 0
    },
    numCourse: {
        type: Number,
        default: 0
    },
    status: {
        type: Boolean,
        default: true
    }
}, {timestamps: true}).plugin(mongoJson)

const InstructorModel = mongoose.model('Instructor', instructorSchema);
module.exports = InstructorModel;