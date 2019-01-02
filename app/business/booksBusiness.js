var path = require('path');
const _ = require('lodash');
const categoryDAL = require(path.join(__dirname, '../DAL/categories'));
const authorDAL = require(path.join(__dirname, '../DAL/authors'));
const bookDAL = require(path.join(__dirname, '../DAL/books'));
const Joi = require('joi');

var getBooks = async () => {
    return await bookDAL.getBooks();
}

var getBookById = async (id) => {
    return await bookDAL.getBookById(id);
}

var searchBooks = async (obj) => {
    return await bookDAL.searchBooks(obj);
}

var validateBookId = async (id) => {
    return await bookDAL.validateBookId(id);
}

var createBook = async (obj) => {
    var authValid = await authorDAL.validateAuthorId(obj.author);
    var catValid = await categoryDAL.validateCategoryId(obj.category);
    if(!authValid) {
        console.log('invalid Author');        
        return ({error: "invalid author id"});
    }
    else if(!catValid) {
        console.log('invalid Category');
        return ({error: "invalid category id"});
    }
    if(await isDuplicate(obj))
    return {error: 'can not have 2 books with the same name'};
    else
    return await bookDAL.createBook(obj);
}

var updateBook = async (id, obj) => {
    if(!await validateBookId(id)) {
        console.log('Book id is not valid');
        return ({error: "invalid book id"});
    }
    if(obj.author) {
        var authValid = await authorDAL.validateAuthorId(obj.author);
        if(!authValid) {
            console.log('invalid Author');        
            return ({error: "invalid author id"});
        }
    }   
    if(obj.category) {
        var catValid = await categoryDAL.validateCategoryId(obj.category);  
        if(!catValid) {
            console.log('invalid Category');
            return ({error: "invalid category id"});
        }
    }
    if(await isDuplicate(obj, id))
    return {error: 'can not have 2 books with the same name'};
    else
    return await bookDAL.updateBook(id, obj);
}

var deleteBook = async (id) => {
    if(!await validateBookId(id)) {
        console.log('Book id is not valid');
        return ({error: "invalid book id"});
    }
    return await bookDAL.deleteBook(id);
}

var invalidBookInput = (book) => {
    const schema = {
        title : Joi.string().required(),
        author : Joi.string(),
        description : Joi.string(),
        isbn : Joi.string(),
        publishYear : Joi.number().integer(),
        pagesNumber : Joi.number().integer(),
        image : Joi.string(),
        category : Joi.string()
    };
    return Joi.validate(book, schema);
}

var isDuplicate = async (obj, id) => {
    var books = await getBooks();
    var exist = _.find(books, {'title' : obj.title});
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

module.exports = {
    getBooks,
    getBookById,
    validateBookId,
    deleteBook,
    createBook,
    updateBook,
    searchBooks,
    invalidBookInput
}
