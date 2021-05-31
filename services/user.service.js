const { Op } = require('sequelize');
const Course = require('../models/course');
const User = require('../models/user');
const UserCourse = require('../models/user-course');
const Instructor = require('../models/instructor');
const CourseReview = require('../models/course-review');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const util = require('util')


async function updateBasicInfo(user) {
    const persistedUser = await User.findByPk(user.id);
    for (const [key, value] of Object.entries(user)) {
        persistedUser[key] = value;
    }
    const updatedUser = await persistedUser.save();
    return updatedUser.toJSON();
}

/**
 * Update password
 * @param userId
 * @param oldPass
 * @param newPass
 * @returns {Promise<void> return new token
 */
async function updatePassword(userId, oldPass, newPass) {
    console.log(oldPass, newPass)
    const user = await User.findByPk(userId);
    console.log(user.toJSON())
    if (bcrypt.compareSync(oldPass, user.password)) {
        const pHash = util.promisify(bcrypt.hash);
        const hashedPassword = await pHash(newPass, 10);
        // bcrypt.hash(newPass, 10, (err, hashedPassword) => {
        user.password = hashedPassword;
        console.log('update password new hashedPassword', hashedPassword);
        user.save().then((res) => console.log('update password successfully'));
        return jwt.sign({username: user.username}, process.env.JWT_SECRET_KEY);
        // })

    } else {
        console.log('wrong password')
        return null
    }
}

module.exports = {
    async findByEmail(email) {
        const user = await User.findOne({
                where: {
                    email
                }
            }
        )
        return user;
    },
    async findByUsername(username) {
        const user = await User.findOne({
                where: {
                    username
                }
            }
        )
        return user;
    },

    async changeRoleUser(userid, roleid) {
        console.log("blablabl",userid, roleid);
        const user = await User.update(
            {
                roleId: 3
            },
            {
                where: {
                    id: userid
                }
            }
        )
        return user;
    },
    async save(user) {
        console.log('save user: ', user);
        const savedUser = await User.build({...user}).save();
        return savedUser;
    },
    updateBasicInfo,
    updatePassword,
    async getAllInstructor() {
        const instructors = await User.findAll({
                attributes: ['id', 'firstName', 'lastName', 'image', 'job'],
                where: {
                    id: {
                        [Op.between]: [4, 10]
                    }
                }
            }
        )
        return instructors.map(instructor => instructor.toJSON());
    },
    async save(user) {
        const savedUser = await User.build({...user}).save();
        return savedUser;
    },
    async getById(userid){
        const instructor = await User.findOne({
            attributes: ['id','image','firstName','lastName'],
            where: {
                id: userid
            }
        });
        return instructor.toJSON();
    },
    async getAllUserCourses(userid, type){
        console.log(userid, type)
        const userCourses = await Course.findAll({
            attributes: ['id','name','rating','image'],
            include:[{
                model: UserCourse,
                where: {
                    userId: userid,
                    type: type
                },
            },{
                model: Instructor,
                as: 'instructor',
                attributes: ['id'],
                include: {
                    model: User,
                    as: 'basicInfo',
                    attributes: ['id', 'firstName', 'lastName']
                }
            }]
        });
        return userCourses.map(userCourse => userCourse.toJSON());
    },

    async deleteUserCourse(userid, courseid, type){
        const deleteResult = await UserCourse.destroy({
            where: {
                userId: userid,
                courseId: courseid,
                type: type
            }
        });
        console.log(deleteResult);
        return deleteResult;
    },

    async createUserCourseReview(userid, courseid, review = '', rating = 5){
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
        try{
            const updateResult = await User.update(
                {
                    status: status
                },
                {
                    where: {
                        id: userid
                    }
                });
            if(updateResult === null) return null;
            return updateResult;
        }
        catch (err){
            throw err;
        }
    }
}