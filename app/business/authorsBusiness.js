var path = require('path');
const _ = require('lodash');
const bookDAL = require(path.join(__dirname, '../DAL/books'));
const authorDAL = require(path.join(__dirname, '../DAL/authors'));
const Joi = require('joi');

var getAuthors = async () => {
    return await authorDAL.getAuthors();
}

var getAuthorById = async (id) => {
    return await authorDAL.getAuthorById(id);
}

var searchAuthors = async (obj) => {
    return await authorDAL.searchAuthors(obj);
}

var validateAuthorId = async (id) => {
    return await authorDAL.validateAuthorId(id);
}

var createAuthor = async (obj) => {
    if(await isDuplicate(obj))
    return {error: 'can not have 2 authors with the same name'};
    else
    return await authorDAL.createAuthor(obj);
}

var updateAuthor = async (id, obj) => {
    if(!await validateAuthorId(id)) {
        console.log('Author id is not valid');
        return ({error: "invalid id"});
    }
    if(await isDuplicate(obj, id))
    return {error: 'can not have 2 authors with the same name'};
    else return await authorDAL.updateAuthor(id, obj);
}

var deleteAuthor = async (id) => {
    if(!await validateAuthorId(id)) {
        console.log('Author id is not valid');
        return ({e: "invalid id"});
    }
    if(await relationExist(id)) {
        console.log('You can not delete an author that has a relation');
        return ({e: "Author who has a relation can not be deleted"});
    }
    return await authorDAL.deleteAuthor(id);
}

var relationExist = async (authId) => {
    var books = await bookDAL.getBooks();
    var exist = _.find(books, {'author' : authId})
    if(exist)
    return true;
    else
    return false;
}

var isDuplicate = async (obj, id) => {
    var authors = await getAuthors();
    var exist = _.find(authors, {'name' : obj.name});
    if(exist) {
        if(id) {
        if(exist.id === id)
        return false;
        }
        return true;
    }
    else
    return false;
}

var invalidAuthorInput = (author) => {
    const schema = {
        name : Joi.string().required(),
        jobTitle : Joi.string(),
        bio : Joi.string()
    };
    return Joi.validate(author, schema);
}

module.exports = {
    getAuthors,
    getAuthorById,
    createAuthor,
    validateAuthorId,
    deleteAuthor,
    updateAuthor,
    searchAuthors,
    invalidAuthorInput
}