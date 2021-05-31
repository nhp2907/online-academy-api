const { Op, Sequelize } = require('sequelize');
const Category = require('../models/category');
const CategoryLink = require('../models/category-link');
const Course = require('../models/course');
const sequelize = require('../models/db');
const SubCategory = require('../models/sub-category');

module.exports = {

    async getAllCategories() {
        try{
            const categories = await Category.findAll({
                include: {
                    model: SubCategory,
                    as: 'subCategories',
                    require: true,
                }
            });
            return categories.map(category => category.toJSON());
        }
        catch(err){
            throw err;
        }
    },

    async createNewCategory(cate) {
        try{
            const category = await Category.create(cate);
            return category.toJSON();
        }
        catch(err){
            throw err;
        }
    },

    async createNewSubCategory(subcategoryname, categoryid) {
        try{
            const subCategory = await SubCategory.create({
                name: subcategoryname,
                status: 1,
            });
            const categoryLink = await CategoryLink.create({
                categoryId: categoryid,
                subCategoryId: subCategory.toJSON().id
            });
            return subCategory.toJSON();
        }
        catch(err){
            throw err;
        }
    },


    async updateCategory(categoryid, categoryname, categorylogo) {
        try{
            var updateParams = {};
            if(categoryname !== null) updateParams['name'] = categoryname;
            if(categorylogo !== null) updateParams['logo'] = categorylogo;
            console.log(updateParams);
            const updateResult = await Category.update(
                updateParams,
                {
                    where: {
                        id: categoryid
                    }
                }
            );
            console.log(updateResult);
            if(updateResult === null) return null;
            return updateResult;
        }
        catch(err){
            throw err;
        }
    },

    async getCategoryById(categoryid) {
        console.log("blasdfsdaf",categoryid);
        try{
            const category = await Category.findOne({
                where: {
                    id: categoryid
                },
                include: {
                    model: SubCategory,
                    as: 'subCategories',
                },
            });
            return category.toJSON();
        }
        catch(err){
            throw err;
        }
    },

    async getSubCategoriesByCategory(categoryid) {
        try{
            const categories = await Category.findAll({
                attributes: ['id','name','logo','image'],
                where: {
                    id : categoryid
                },
                limit: 1,
                include: {
                    model: SubCategory,
                    as: 'subCategories',
                    attributes: ['id','name']
                },
            });
            return categories.map(category => category.toJSON());
        }
        catch(err){
            throw err;
        }
    },
    async getMostEnrollCategories() {
        try{
            const mostEnrollCategories = await CategoryLink.findAll({
                attributes: [
                    [Sequelize.col('subCategory.name'), 'subName'],
                    [Sequelize.fn('sum', Sequelize.col('courses.num_student_enroll')), 'total'],
                ],
                group: [[sequelize.literal('subName')]],
                order: [[sequelize.literal('total'), 'DESC']],
                include: [{
                    model: Course,
                    as: 'courses',
                    attributes: [],
                },{
                    model: SubCategory,
                    as: 'subCategory',
                    attributes: [],
                },{
                    model: Category,
                    as: 'category',
                    attributes: ['id','name'],
                }]
            });
            return mostEnrollCategories.map(category => category.toJSON()).slice(0, 5);
        }
        catch(err){
            throw err;
        }
    },
    async getPopularSubCategoriesByCategory(categoryid) {
        try{
            const popularSubcategoriesByCategory = await CategoryLink.findAll({
                attributes: [
                    [Sequelize.col('subCategory.name'), 'subName'],
                    [Sequelize.fn('sum', Sequelize.col('courses.num_student_enroll')), 'total']
                ],
                group: [[sequelize.literal('subName')]],
                order: [[sequelize.literal('total'), 'DESC']],
                where: {
                    categoryId: {
                        [Op.eq]: categoryid
                    }
                },
                include: [{
                    model: Course,
                    as: 'courses',
                    attributes: [],
                },{
                    model: SubCategory,
                    as: 'subCategory',
                    attributes: [],
                }]
            });
            return popularSubcategoriesByCategory.map(category => category.toJSON()).slice(0, 6);
        }
        catch(err){
            throw err;
        }
    },
    async changeStatusCategory(categoryid, status) {
        try{
            console.log("param", categoryid, status);
            const updateResult = await Category.update(
                {
                    status: status
                },
                {
                where: {
                    id: categoryid
                }
            });
            if(updateResult === null) return null;
            return updateResult;
        }
        catch (err){
            throw err;
        }
    },
    async findCategoryLink(categoryId, subCategoryId) {
       const link = await CategoryLink.findOne({
            where: {
                categoryId,
                subCategoryId
            }
        });
       return link.toJSON();
    }


}