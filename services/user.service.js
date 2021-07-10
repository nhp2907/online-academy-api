const {Op} = require('sequelize');
const Course = require('../models/course');
const User = require('../models/user');
const UserCourse = require('../models/user-course');
const Instructor = require('../models/instructor');
const CourseReview = require('../models/course-review');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const util = require('util')
const UserModel = require('./../schemas/user.schema')

async function updatePassword(userId, oldPass, newPass) {
    const user = await UserModel.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    if (bcrypt.compareSync(oldPass, user.password)) {
        if (bcrypt.compareSync(newPass, user.password)) {
            throw new Error("New password is recently used")
        }

        const pHash = util.promisify(bcrypt.hash);
        const hashedPassword = await pHash(newPass, 10);
        user.password = hashedPassword;
        console.log('update password new hashedPassword', hashedPassword);
        await UserModel.updateOne({_id: userId}, {password: hashedPassword})
        return jwt.sign({username: user.username}, process.env.JWT_SECRET_KEY);

    } else {
        throw new Error("Password is incorrect!");
    }
}


module.exports = {
    updatePassword,
    async createUserCourseReview(userid, courseid, review = '', rating = 5) {
        const createResult = await CourseReview.create({
            userId: userid,
            courseId: courseid,
            content: review,
            rating: rating
        });
        return createResult;
    },

    async getAllUser() {
        const users = await User.findAll({
                include: {
                    model: Instructor
                }
            }
        )
        return users.map(user => user.toJSON());
    },

    async getUserById(userid) {
        const user = await User.findOne({
                where: {
                    id: userid
                },
                include: {
                    model: Instructor
                }
            }
        )
        console.log(user);
        return user.toJSON();
    },

    async changeStatusUser(userid, status) {
        try {
            const updateResult = await User.update(
                {
                    status: status
                },
                {
                    where: {
                        id: userid
                    }
                });
            if (updateResult === null) return null;
            return updateResult;
        } catch (err) {
            throw err;
        }
    }
}