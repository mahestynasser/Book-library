const db = require('../db/booksDB');
const _ = require('lodash');
const uuidv4 = require('uuid/v4');

var getBooks = async () => {
 var data = await db.readDB();
 return data["books"];
}

var getBookById = async (id) => {
    var res = await getBooks();
    return  _.find(res, {'id' : id})
}

var searchBooks = async (obj) => {
    var books = await getBooks();
    var filter = obj.filter;
    if(filter)
    books = _.filter(books, filter);
    var sort = obj.sort;
    if(sort)
    books = _.sortBy(books, sort.values);
    var paging = obj.paging;
    if(paging) {
        var index = paging.index;
        var number = paging.number;
        var start = Math.min((index-1)*number, books.length-1);
        var end = Math.min((start+number), books.length-1);
        var pagedBooks = [];
        for(var i=start; i< end; i++) {
            pagedBooks.push(books[i]);
        }
        return pagedBooks;
    }
    else {
        return books;
    }
}

var validateBookId = async (id) => {
    var book = await getBookById(id);
    if(book)
    return true
    else
    return false;
}

var createBook = async (obj) => {
        var book = {
            id : uuidv4(),
            title : obj.title,
            author : obj.author,
            description : obj.description,
            isbn : obj.isbn,
            publishYear : obj.publishYear,
            pagesNumber : obj.pagesNumber,
            image : obj.image,
            category : obj.category
        }
        var data = await db.readDB();
        data["books"].push(book);
        await db.writeToDB(data);
        return book;
}

var updateBook = async (id, obj) => {
    var data = await db.readDB();
    var books = data["books"];
    var book = _.find(books, {'id' : id})
    book.title = obj.title || book.title;
    book.author = obj.author || book.author;
    book.description = obj.description || book.description;
    book.isbn = obj.isbn || book.isbn;
    book.publishYear = obj.publishYear || book.publishYear;
    book.pagesNumber = obj.pagesNumber || book.pagesNumber;
    book.image = obj.image || book.image;
    book.category = obj.category || book.category;
    await db.writeToDB(data);
    return await getBookById(id);
}

var deleteBook = async (id) => {
    var data = await db.readDB();
        _.remove(data["books"], function(o) { return o.id === id; });
        await db.writeToDB(data);
        return {error: undefined};
}

var test = () => {
    //updateBook('2a8ccee7-2790-47a3-9a22-bfcac09cd6a2', 'My Failure Journey <3', undefined, undefined, undefined, undefined, undefined, undefined, undefined).then(console.log);
//deleteBook('7d060cf0-95f5-48b4-b770-c8d398edccd1').then(console.log);
// createBook('Test book', 'e9d433a8-a728-44c6-9860-35beb939d7d8', 'Failure', '12345', 2018, 1000, 'https://lorempixel.com/220/300/abstract?id=271cd386-c9a0-4baf-b2ce-70f1373aeb92', '936dbf5c-f99f-4633-b636-61dc15b0d064' ).then(console.log
// )
// getBooks().then((message) => {
//     console.log(message);
//   });
// getBookById('2a8ccee7-2790-47a3-9a22-bfcac09cd6a2').then((r) => {console.log(r);
// });
// searchBooks({sort : {values : ['publishYear']}, paging : {index : 8, number : 2}}).then(console.log);
}


module.exports = {
    getBooks,
    getBookById,
    validateBookId,
    deleteBook,
    createBook,
    updateBook,
    searchBooks
}