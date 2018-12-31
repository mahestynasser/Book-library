var path = require('path');
const _ = require('lodash');
const categoryDAL = require(path.join(__dirname, '../DAL/categories'));
const bookDAL = require(path.join(__dirname, '../DAL/books'));
const Joi = require('joi');

var getCategories = async() => {
    return await categoryDAL.getCategories();
};

var getCategoryById = async(id) => {
    return await categoryDAL.getCategoryById(id);
};

var searchCategories = async(obj) => {
    return await categoryDAL.searchCategories(obj);
};

var createCategory = async(obj) => {
    return await categoryDAL.createCategory(obj);
}

var validateCategoryId = async(id) => {
    return await categoryDAL.validateCategoryId(id);
}

var relationExist = async (id) => {
    var books = await bookDAL.getBooks();
    var exist = _.find(books, {'category' : id})
    if(exist)
    return true;
    else
    return false;
}

var invalidCategoryInput = (category) => {
    const schema = {
        name : Joi.string().required()
    };
    return Joi.validate(category, schema);
}

var updateCategory = async(id, obj) => {
    var vc = await validateCategoryId(id);
    if(!vc) {
        console.log('Category id is not valid');
        return ({error: "invalid category id"});
    }
    else return await categoryDAL.updateCategory(id, obj);
}

var deleteCategory = async (id) => { 
    if(!await validateCategoryId(id)) {
        console.log('Category id is not valid');
        return ({e: "invalid id"});
    }
    if(await relationExist(id)) {
        console.log('You can not delete a category that has a relation');
        return ({e: "Category that has a relation can not be deleted"});
    }
    return await categoryDAL.deleteCategory(id);
}

module.exports = {
    getCategories,
    getCategoryById,
    validateCategoryId,
    createCategory,
    deleteCategory,
    searchCategories,
    invalidCategoryInput,
    updateCategory
}