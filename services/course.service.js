const fs = require('fs');

const Course = require('../models/course');
const CourseChapter = require("../models/course-chapter");
const Instructor = require("../models/instructor");
const User = require("../models/user");
const CourseReview = require("../models/course-review");
const CourseChapterSection = require("../models/course-chapter-section");
const Advancement = require("../models/advancement");
const {Op} = require('sequelize');
const CategoryLink = require('../models/category-link');
const Level = require('../models/level');
const SubCategory = require('../models/sub-category');
const Category = require('../models/category');
const UserCourse = require('../models/user-course');

const save = async (course) => {
    const savedCourse = await Course.create(course);
    return savedCourse.toJSON();
}

const update = async (course) => {
    const savedCourse = await Course.findByPk(course.id);

    for (const [key, value] of Object.entries(course)) {
        savedCourse[key] = value;
    }
    const updatedCourse = await savedCourse.save();
    return updatedCourse.toJSON();

}

const getPagination = (page, size) => {
    const limit = size ? +size : 5;
    const offset = 0 + (page - 1) * limit;
    return {limit, offset};
};

const getPagingData = (data, page, limit) => {
    const {count: totalItems} = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return {totalItems, totalPages, currentPage};
};

const findAll = async () => {
    const courses = await Course.findAll({
        include: [{
            model: CourseChapter,
            as: 'chapters',
            include: {
                model: CourseChapterSection,
                as: 'sections'
            }
        }, {
            model: Instructor,
            as: 'instructor',
            include: {
                model: User,
                as: 'basicInfo'
            }
        }, {
            model: CourseReview,
            as: 'reviews'
        },{
            model: CategoryLink,
            as: 'categoryLink',
            include: {
                model: SubCategory,
                as: 'subCategory'
            }
        }]
    });
    return courses.map(c => c.toJSON());
}

const countRating = async (courseId, rating) => {
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

const findById = async (id) => {
    const course = await Course.findOne({
        where: {
            id
        },
        include: [{
            model: CourseChapter,
            as: 'chapters',
            include: {
                model: CourseChapterSection,
                as: 'sections'
            }
        }, {
            model: Instructor,
            as: 'instructor',
            include: {
                model: User,
                as: 'basicInfo'
            }
        }, {
            model: CourseReview,
            as: 'reviews',
            include: {
                model: User,
                as: 'user'
            },
            limit: 10,
        }, {
            model: Advancement,
            as: 'advancement'
        },{
            model: CategoryLink,
            as: 'categoryLink',
            include: {
                model: SubCategory,
                as: 'subCategory'
            }
        },{
            model: Level,
            as: 'level'
        },{
            model: Advancement,
            as: 'advancement'
        }]
    });

    return course.toJSON();
}

const getTopCoursesInWeek = async () => {
    try {
        const topCoursesInWeek = await Course.findAll({
            attributes: ['id', 'name', 'headline', 'image', 'price', 'discount', 'prePrice', 'language', 'rating', 'numReview', 'numLecture', 'numStudentEnroll', 'estimateContentLength', 'updated_date'],
            limit: 3,
            where: {
                updatedDate: {
                    [Op.gt]: new Date(new Date() - 1000 * 24 * 60 * 3600)
                }
            },
            order: [
                ['discount', 'DESC'],
                ['rating', 'DESC']
            ],
            include: [{
                model: Instructor,
                as: 'instructor',
                attributes: ['id'],
                include: {
                    model: User,
                    as: 'basicInfo',
                    attributes: ['id', 'firstName', 'lastName']
                }
            },
            {
                model: Advancement,
                as: 'advancement',
                attributes: ['id', 'description'],
                where: {
                    description: {
                        [Op.substring]: '%BestSeller%'
                    }
                }
            },{
                model: Level,
                as: 'level',
                attributes: ['id','description'],
            }]
        });
        return topCoursesInWeek.map(course => course.toJSON());
    } catch (err) {
        throw err;
    }
}

const getNewestCourses = async () => {
    try {
        const newestCourses = await Course.findAll({
            attributes: ['id', 'name', 'headline', 'image', 'price', 'discount', 'prePrice', 'language', 'rating', 'numReview', 'numLecture', 'numStudentEnroll', 'estimateContentLength', 'updated_date'],
            limit: 10,
            order: [
                ['created_date', 'DESC']
            ],
            include: [{
                model: Instructor,
                as: 'instructor',
                attributes: ['id'],
                include: {
                    model: User,
                    as: 'basicInfo',
                    attributes: ['id', 'firstName', 'lastName']
                }
            },
                {
                    model: Advancement,
                    as: 'advancement',
                    attributes: ['id', 'description'],
                }]
        });
        return newestCourses.map(course => course.toJSON());
    } catch (err) {
        throw err;
    }
}

const getMostEnrollCourses = async () => {
    try {
        const mostEnrollCourses = await Course.findAll({
            attributes: ['id', 'name', 'headline', 'image', 'price', 'discount', 'prePrice', 'language', 'rating', 'numReview', 'numLecture', 'numStudentEnroll', 'estimateContentLength', 'updated_date'],
            limit: 10,
            order: [
                ['numStudentEnroll', 'DESC']
            ],
            include: [{
                model: Instructor,
                as: 'instructor',
                attributes: ['id'],
                include: {
                    model: User,
                    as: 'basicInfo',
                    attributes: ['id', 'firstName', 'lastName']
                }
            },
                {
                    model: Advancement,
                    as: 'advancement',
                    attributes: ['id', 'description'],
                }]
        });
        return mostEnrollCourses.map(course => course.toJSON());
    } catch (err) {
        throw err;
    }
}
const getCategoryCourses = async (categoryid, page, size, duration, rating, level, price, order, topic) => {
    try {
        const {limit, offset} = getPagination(page, size);
        const categoryCourses = await Course.findAndCountAll({
            attributes: ['id', 'name', 'headline', 'image', 'price', 'rating', 'numReview', 'numLecture', 'numStudentEnroll', 'estimateContentLength'],
            limit,
            offset,
            where: {
                rating: {
                    [Op.gte]: rating
                },
                estimateContentLength: {
                    [Op.between]: [duration[0], duration[1]]
                },
                price: {
                    [Op.between]: [price[0], price[1]]
                },
            },
            order: [
                order == 'price-low-to-high' ? ['price', 'ASC'] :
                    order == 'price-high-to-low' ? ['price', 'DESC'] :
                        order == 'top-rating' ? ['rating', 'DESC'] :
                            order == 'top-enrolled' ? ['numStudentEnroll', 'DESC'] :
                                order == 'top-newest' ? ['createdDate', 'DESC'] : ['numStudentEnroll', 'DESC']
            ],
            include: [{
                model: Instructor,
                as: 'instructor',
                attributes: ['id'],
                include: {
                    model: User,
                    as: 'basicInfo',
                    attributes: ['id', 'firstName', 'lastName']
                }
            },
                {
                    model: Advancement,
                    as: 'advancement',
                    attributes: ['id', 'description'],
                },
                {
                    model: CategoryLink,
                    as: 'categoryLink',
                    attributes: ['id'],
                    where: {
                        categoryId: categoryid
                    },
                    include: {
                        model: SubCategory,
                        as: 'subCategory',
                        attributes: [],
                        where: {
                            name: {
                                [Op.like]: topic == '' ? '%%' : topic
                            }
                        }
                    }
                },
                {
                    model: Level,
                    as: 'level',
                    attributes: ['id', 'description'],
                    where: {
                        id: {
                            [Op.in]: level
                        }
                    }
                }]
        });
        const categorycourses = categoryCourses.rows.map(course => course.toJSON());
        const pageCount = getPagingData(categoryCourses, page, limit);
        return {pageCount, categorycourses};
    } catch (err) {
        throw err;
    }
}
const checkExsistCategoryCourses = async (categoryid) => {
    try {
        const countCourses = await Course.count({
            include: {
                model: CategoryLink,
                as: 'categoryLink',
                where: {
                    categoryId: categoryid
                }
            }
        });
        return countCourses;
    } catch (err) {
        throw err;
    }
}
const getPopularCategoryCourses = async (categoryid) => {
    try {
        const popularCatetogyCourses = await Course.findAll({
            attributes: ['id', 'name', 'headline', 'image', 'price', 'prePrice', 'rating', 'numReview', 'numLecture', 'numStudentEnroll', 'estimateContentLength'],
            order: [
                ['numStudentEnroll', 'DESC'],
                ['rating', 'DESC']
            ],
            include: [{
                model: Instructor,
                as: 'instructor',
                attributes: ['id'],
                include: {
                    model: User,
                    as: 'basicInfo',
                    attributes: ['id', 'firstName', 'lastName']
                }
            },
                {
                    model: Advancement,
                    as: 'advancement',
                    attributes: ['id', 'description'],
                },
                {
                    model: CategoryLink,
                    as: 'categoryLink',
                    attributes: ['id'],
                    where: {
                        categoryId: categoryid
                    }
                },
                {
                    model: Level,
                    as: 'level',
                    attributes: ['id', 'description'],
                    where: {
                        id: {
                            [Op.or]: [1, 2]
                        }
                    }
                }]
        });
        console.log()
        return popularCatetogyCourses.map(course => course.toJSON()).slice(0, 10);
    } catch (err) {
        throw err;
    }
}

const getAllLevel = async () => {
    const levels = await Level.findAll();
    return levels.map(l => l.toJSON());
}

const findByInstructorId = async (instructorId) => {
    const courses = await Course.findAll({
        where: {
            instructorId
        }
    })
    const st = courses.map(c => c.toJSON());

    console.log(st);

    return st;
}

const getCourseChapter = async (courseid) => {
    try {
        const courseChapters = await CourseChapter.findAll({
            where: {
                courseId: courseid,
            },
            include: {
                model: CourseChapterSection,
                as: 'sections'
            }
        });
        console.log(courseChapters.map(course => course.toJSON()));
        return courseChapters.map(course => course.toJSON());
    } catch (err) {
        throw err;
    }
}

const getSectionVideo = async (sectionid) => {
    try {
        const sectionVideo = await CourseChapterSection.findOne({
            attributes: ['urlVideo'],
            where: {
                id: sectionid,
            }
        });
        console.log(sectionVideo.toJSON())
        return sectionVideo.toJSON();
    } catch (err) {
        throw err;
    }
}
const changeStatusCourse = async (courseid, status) => {
    try{
        const updateResult = await Course.update(
            {
                status: +status
            },
            {
            where: {
                id: courseid
            }
        });
        if(updateResult === null) return null;
        return updateResult;
    }
    catch (err){
        throw err;
    }
}

const checkCourseBeLongToInstructor = async (courseId, instructorId) => {
    const courses = await Course.findOne({
        where: {
            instructorId
        }
    })

    return courses != null && courses != undefined;
}

async function addChapter(chapter) {
    const newChapter = await CourseChapter.create(chapter);
    return newChapter.toJSON();
}

async function addLesion(lesion) {
    const newLesion = await CourseChapterSection.create(lesion);
    return newLesion.toJSON();
}

async function updateLesion(lesion) {
    const savedLesion = await CourseChapterSection.findByPk(lesion.id);

    for (const [key, value] of Object.entries(lesion)) {
        savedLesion[key] = value;
    }
    const updatedLesion = await savedLesion.save();
    return updatedLesion.toJSON();
}

async function deleteLesion(id) {
    const lesion = await CourseChapterSection.findByPk(id);
    fs.rmSync(`public/` + lesion.urlVideo, {
        force: true,
    });
    return await lesion.destroy();
}

async function deleteChapter(id) {
    console.log('delete')
    const chapter = await CourseChapter.findByPk(id);
    // select lesson belong to chapter. delete lesson first
    const lesson = await CourseChapterSection.findAll({
        where: {
            courseChapterId: id
        }
    });
    const temp = await Promise.all(lesson.map(e => e.destroy()));
    console.log(temp)
    return await chapter.destroy();
}

async function findLesionById(id) {
    const lesion = await CourseChapterSection.findByPk(id);
    return lesion.toJSON();
}

async function getRelatedCourses(courseId) {
    const course = await Course.findByPk(courseId);
    const categoryLink = await CategoryLink.findOne({
        where: {
            id: course.categoryLinkId
        }
    });
    const courses = await Course.findAll({
        where: {
            categoryLinkId: categoryLink.id,
        },
        include: [{
            model: Advancement,
            as: 'advancement'
        }],
        limit: 5,
    })

    return courses.map(c => c.toJSON());
}

async function publicCourse(courseId) {
    return await Course.update({status: 1}, {
        where: {
            id: courseId
        }
    })
}

async function deleteCourse(courseId) {
    const course = await Course.findByPk(courseId);
    const chapters = await CourseChapter.findAll({
        where: {
            courseId: course.id
        }
    })
    console.log(chapters.length);

    const deleteResult = Promise.all(chapters.map(c => CourseChapterSection.destroy({
        where: {
            courseChapterId: c.id
        }
    })))
    const deleteChapter = await Promise.all(chapters.map(c => c.destroy()));
    return await course.destroy();
}

module.exports = {
    save,
    update,
    findById,
    findAll,
    getTopCoursesInWeek,
    getNewestCourses,
    getMostEnrollCourses,
    getCategoryCourses,
    getPopularCategoryCourses,
    getAllLevel,
    findByInstructorId,
    getCourseChapter,
    getSectionVideo,
    changeStatusCourse,
    checkExsistCategoryCourses,
    checkCourseBeLongToInstructor,
    addChapter,
    addLesion,
    updateLesion,
    deleteLesion,
    deleteChapter,
    findLesionById,
    countRating,
    getRelatedCourses,
    publicCourse,
    deleteCourse,
}