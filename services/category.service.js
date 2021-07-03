const CategoryModel = require("../schemas/category.schema");

const findCategories = async (query) => {
    return await CategoryModel.find({...query}).exec();
}

const updateCate = async (cate) => {
    let newVar = await CategoryModel.updateOne({_id: cate.id}, cate, {upsert: true});
    return newVar
}

const createCate = async (cate) => {
    const sameNameCate = await CategoryModel.find({uniqueName: cate.name.toLowerCase(), parentId: cate.parentId}).exec();
    if (sameNameCate.length > 0) {
        throw new Error(`Category ${cate.name} already exist`)
    }
    if (cate.level === 2) {
        if (!cate.parentId) {
            throw new Error(`Category must belong to a parent`)
        }
    }

    cate.uniqueName = cate.name.toLowerCase();
    const newCategory = await CategoryModel.create(cate);
    if (cate.level === 2) {
        const parent = await CategoryModel.findById(cate.parentId);
        if (parent.subs) {
            parent.subs.push(newCategory._id);
        } else {
            parent.subs = [newCategory._id]
        }
        const updateResult = await CategoryModel.findByIdAndUpdate(parent._id, parent);
    }
    return newCategory;
}

module.exports = {
    createCate,
    updateCate,
    findCategories
}