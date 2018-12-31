var db = require('../db/booksDB');
const _ = require('lodash');
const uuidv4 = require('uuid/v4');


var getCategories = async () => {
    
 var data = await db.readDB();
 return data["categories"];
}

var searchCategories = async (obj) => {
    //obj => object that has 3 objects in it filter object that is an object to filter on,
//sorting object that has an array consisting of the things to sort by use _.sortBy
//the thir is an object consisting of index, and number => real index is calculated by (index-1)*number
    var categories = await getCategories();
    var filter = obj.filter;
    if(filter)
    categories = _.filter(categories, filter);
    var sort = obj.sort;
    if(sort)
    categories = _.sortBy(categories, sort.values);
    var paging = obj.paging;
    if(paging) {
        var index = paging.index;
        var number = paging.number;
        var start = Math.min((index-1)*number, categories.length-1);
        var end = Math.min((start+number), categories.length-1);
        var pagedCategories = [];
        for(var i=start; i< end; i++) {
            pagedCategories.push(categories[i]);
        }
        return pagedCategories;
    }
    else {
        return categories;
    }
}

var getCategoryById = async (id) => {
    var res = await getCategories();
    return  _.find(res, {'id' : id})
}

var validateCategoryId = async (id) => {
    var category = await getCategoryById(id);    
    if(category){
        return true;
    }
    else{
        return false;
    }
}

var createCategory = async (obj) => {
    var cat = {
        id : uuidv4(),
        name : obj.name
    }
    var data = await db.readDB();
    data["categories"].push(cat);
    await db.writeToDB(data);
    return cat;
}

var updateCategory = async (id, obj) => {
    var data = await db.readDB();
    var categories = data["categories"];
    var category = _.find(categories, {'id' : id})
    category.name = obj.name || category.name;
    await db.writeToDB(data);
    return await getCategoryById(id);
}

var deleteCategory = async (id) => {   
    var data = await db.readDB();
        _.remove(data["categories"], function(o) { return o.id === id; });
        await db.writeToDB(data);
        return {e: undefined};
}

var test = () => {
//createCategory('Test category').then(console.log);
//deleteCategory('f0b8154b-e18a-4dee-a28c-f377473f06e6').then(console.log);
//getCategories().then((r)=> {console.log(r)});
// });
//updateCategory('936dbf5c-f99f-4633-b636-61dc15b0d0', 'Harry Potter <3').then(console.log);
//searchCategories({sort : {values : ['name']}, paging : {index : 8, number : 2}}).then(console.log);
}


module.exports = {
    getCategories,
    getCategoryById,
    validateCategoryId,
    createCategory,
    deleteCategory,
    searchCategories,
    updateCategory
}