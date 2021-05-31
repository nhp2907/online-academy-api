const CourseReview = require("../models/course-review");



const countNumberOfRating = async (courseId, rating) => {
    const where = {
        courseId
    }
    if (rating) {
        where.rating = rating;
    }
    return await CourseReview.count({
        where
    })
}

module.exports = {
    countNumberOfRating,
}