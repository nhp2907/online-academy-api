const express = require('express')
const UserService = require("../services/user.service");
const router = express.Router();

const multer = require('multer')
const UserModel = require("../schemas/user.schema");
const UserRole = require("../constant/UserRole");
const CourseModel = require("../schemas/course.schema");

router.get('/top-course', async (req, res) => {
    const query = req.query;
    // const courses = await CourseModel.find({})
    //     .where('disabled').ne(true)
    //     .where('deleted').ne(true)
    //     .sort({updatedAt: -1, rating: -1}).limit(query.count || 3).exec();

    const courses = await CourseModel.aggregate([
        {
            $match: {
                $and: [
                    {disabled: {$ne: true}},
                    {deleted: {$ne: true}}
                ]
            }
        },
        {
            $lookup: {
                from: 'categories',
                localField: 'categoryId',
                foreignField: '_id',
                as: 'category'
            }
        },
        {
            $unwind: "$category"

        },
        {
            $lookup: {
                from: 'instructors',
                let: {instructorId: '$instructorId'},
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$instructorId"]
                            }
                        },
                    }, {
                        $lookup: {
                            from: 'users',
                            localField: 'userId',
                            foreignField: '_id',
                            as: 'user'
                        }
                    },
                    {
                        $addFields: {
                            user: {$arrayElemAt: ['$user', 0]},
                        }
                    },
                    {
                        $project: {
                            author: {$concat: ['$user.firstName', ' ', '$user.lastName']}
                        }
                    }
                ],
                as: 'instructor'
            }
        },
        {
            $unwind: "$instructor"
        },
        {
            $addFields: {
                "author": "$instructor.author",
                "categoryName": "$category.name",
                id: "$_id"
            }
        },
        {
            $project: {
                category: 0,
                instructor: 0,
            }
        },
    ]).sort({rating: -1, updatedAt: -1})
        .limit(query.count || 3).exec();

    res.send(courses)
})

router.get('/most-view-course', async (req, res) => {
    const query = req.query;
    // const courses = await CourseModel.find()
    //     .where('disabled').ne(true)
    //     .where('deleted').ne(true)
    //     .sort({updatedAt: -1, views: -1}).limit(query.count || 10).exec();

    const courses = await CourseModel.aggregate([
        {
            $match: {
                $and: [
                    {disabled: {$ne: true}},
                    {deleted: {$ne: true}}
                ]
            }
        },
        {
            $lookup: {
                from: 'categories',
                localField: 'categoryId',
                foreignField: '_id',
                as: 'category'
            }
        },
        {
            $unwind: "$category"

        },
        {
            $lookup: {
                from: 'instructors',
                let: {instructorId: '$instructorId'},
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$instructorId"]
                            }
                        },
                    }, {
                        $lookup: {
                            from: 'users',
                            localField: 'userId',
                            foreignField: '_id',
                            as: 'user'
                        }
                    },
                    {
                        $addFields: {
                            user: {$arrayElemAt: ['$user', 0]},
                        }
                    },
                    {
                        $project: {
                            author: {$concat: ['$user.firstName', ' ', '$user.lastName']}
                        }
                    }
                ],
                as: 'instructor'
            }
        },
        {
            $unwind: "$instructor"
        },
        {
            $addFields: {
                "author": "$instructor.author",
                "categoryName": "$category.name",
                id: "$_id"
            }
        },
        {
            $project: {
                category: 0,
                instructor: 0,
            }
        },
    ]).sort({views: -1, updatedAt: -1})
        .limit(query.count || 10).exec();

    res.send(courses)
})

router.get('/latest-course', async (req, res) => {
    const query = req.query;
    // const courses = await CourseModel.find()
    //     .where('disabled').ne(true)
    //     .where('deleted').ne(true)
    //     .sort({updatedAt: -1}).limit(query.count || 10).exec();


    const courses = await CourseModel.aggregate([
        {
            $match: {
                $and: [
                    {disabled: {$ne: true}},
                    {deleted: {$ne: true}}
                ]
            }
        },
        {
            $lookup: {
                from: 'categories',
                localField: 'categoryId',
                foreignField: '_id',
                as: 'category'
            }
        },
        {
            $unwind: "$category"

        },
        {
            $lookup: {
                from: 'instructors',
                let: {instructorId: '$instructorId'},
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$instructorId"]
                            }
                        },
                    }, {
                        $lookup: {
                            from: 'users',
                            localField: 'userId',
                            foreignField: '_id',
                            as: 'user'
                        }
                    },
                    {
                        $addFields: {
                            user: {$arrayElemAt: ['$user', 0]},
                        }
                    },
                    {
                        $project: {
                            author: {$concat: ['$user.firstName', ' ', '$user.lastName']}
                        }
                    }
                ],
                as: 'instructor'
            }
        },
        {
            $unwind: "$instructor"
        },
        {
            $addFields: {
                "author": "$instructor.author",
                "categoryName": "$category.name",
                id: "$_id"
            }
        },
        {
            $project: {
                category: 0,
                instructor: 0,
            }
        },
    ]).sort({updatedAt: -1})
        .limit(query.count || 10).exec();

    res.send(courses)
})


module.exports = router