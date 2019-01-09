var fs = require('fs');
var path = require('path');

var readDB = () => {
return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, 'booksFromExcell.json'), (err, data) => {
        if(err) {
            reject(err);
        }
        try {
            resolve(JSON.parse(data));
        }
        catch(err) {
            reject(err);
        }
        
    });
});
}

var writeToDB = (data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(path.join(__dirname, 'booksFromExcell.json'), JSON.stringify(data), (err) => {
            if(err)
            reject(err);
            else 
            resolve();
        });
    });
}

//console.log(readDB());

module.exports = {
    readDB,
    writeToDB
}
