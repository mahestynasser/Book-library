var db = require('../db/booksDB');
const _ = require('lodash');
const uuidv4 = require('uuid/v4');

var getAuthors = async () => {  
 var data = await db.readDB();
 return data["authors"];
}

var getAuthorById = async (id) => {
    var res = await getAuthors();
    return  _.find(res, {'id' : id})
}

var searchAuthors = async (obj) => {
    var authors = await getAuthors();
    var filter = obj.filter;
    if(filter)
    authors = _.filter(authors, filter);
    var sort = obj.sort;
    if(sort)
    authors = _.sortBy(authors, sort.values);
    var paging = obj.paging;
    if(paging) {
        var index = paging.index;
        var number = paging.number;
        var start = Math.min((index-1)*number, authors.length-1);
        var end = Math.min((start+number), authors.length-1);
        var pagedAuthors = [];
        for(var i=start; i< end; i++) {
            pagedAuthors.push(authors[i]);
        }
        return pagedAuthors;
    }
    else {
        return authors;
    }
}

var validateAuthorId = async (id) => {
    var author = await getAuthorById(id);
    if(author)
    return true
    else
    return false;
}

var createAuthor = async (obj) => {
    var auth = {
        id : uuidv4(),
        name : obj.name,
        jobTitle : obj.jobTitle,
        bio : obj.bio
    }
    var data = await db.readDB();
    data["authors"].push(auth);
    await db.writeToDB(data);
    return auth;
}

var updateAuthor = async (id, obj) => {
    var data = await db.readDB();
    var authors = data["authors"];
    var author = _.find(authors, {'id' : id})
    author.name = obj.name || author.name;
    author.jobTitle = obj.jobTitle || author.jobTitle;
    author.bio = obj.bio || author.bio;
    await db.writeToDB(data);
    return await getAuthorById(id);
}

var deleteAuthor = async (id) => {
    var data = await db.readDB();
    _.remove(data["authors"], function(o) { return o.id === id; });
    await db.writeToDB(data);
    return {e: undefined};  
}

var test = () => {
    // if(validateAuthorInput({name: 'mahy'}))
// console.log('error');
// else console.log('no error');


// if(error) {
//     res.status(400).send(error.details[0].message);
//     return;
// }


//updateAuthor('e9d433a8-a728-44c6-9860-35beb939d7d8',undefined,undefined,'loves battee5').then(console.log);
//deleteAuthor('a8d75788-02a3-4ccf-8606-bdbf3cc13089').then(console.log);
//  createAuthor('Test Author', 'Software Engineer', 'test' ).then((r) => {console.log(r);
//      });
// getAuthorById('e9d433a8-a728-44c6-9860-35beb939d7d8').then((r) => {console.log(r);
// });
// validateAuthorId('edd209df-b6a6-454d-8ac4-0c19f2140752').then((r)=> {console.log(r);
// });
 //getAuthors().then(console.log);

}


module.exports = {
    getAuthors,
    getAuthorById,
    createAuthor,
    validateAuthorId,
    deleteAuthor,
    updateAuthor,
    searchAuthors
}