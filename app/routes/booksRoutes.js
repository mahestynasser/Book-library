var path = require('path');
const _ = require('lodash');
const express = require('express');
const bookBusiness = require(path.join(__dirname, '../business/booksBusiness'));
var {logger} = require('../logger');


const router = express.Router();

router.get('/', async(req, res) => {
    try {
        var books = await bookBusiness.getBooks();
        res.send({
            data : books,
            status : 'success'
        });
    }
    catch(err) {
        logger.log({
            level: 'error',
            message: err,
            time: new Date()
          });
        res.status(500).send({
            data : err,
            status : 'fail'
        });
    }
  });

router.get('/:id', async(req, res) => {
    try {
        var id = req.params.id;
        var existingId = await bookBusiness.validateBookId(id);
        if(existingId) {
            var book = await bookBusiness.getBookById(id);
            res.send({
                data : book,
                status : 'success'
            });
        }
        else {
            logger.log({
                level: 'error',
                message: "Invalid book id",
                time: new Date()
              });
             res.status(400).send({
                data : 'Invalid book id',
                status : 'fail'
            }); 
             return;
        }
    }
    catch(err) {
        logger.log({
            level: 'error',
            message: err,
            time: new Date()
          });
        res.status(500).send({
            data : err,
            status : 'fail'
        });
    }
  });

router.post('/search', async(req, res) => {
    try {
        var book = await bookBusiness.searchBooks(req.body);
        res.send({
            data : book,
            status : 'success'
        });
    }
    catch(err) {
        logger.log({
            level: 'error',
            message: err,
            time: new Date()
          });
        res.status(500).send({
            data : err,
            status : 'fail'
        });
    }
  });

  router.delete('/:id', async(req, res) => {
    try {
 var {error} = await bookBusiness.deleteBook(req.params.id);
  if(error) {
    logger.log({
        level: 'error',
        message: error,
        time: new Date()
      });
      res.status(400).send({
        data : error,
        status : 'fail'
    }); 
  }
  else {
      res.send({
        data : req.params.id,
        status : 'success'
    })
       }
  }
  catch(err) {
    //  console.log(err);
    logger.log({
        level: 'error',
        message: err,
        time: new Date()
      });
      res.status(500).send({
        data : err,
        status : 'fail'
    });
  }
});

  router.post('/create', async(req, res) => {
    try {
        var {error} = bookBusiness.invalidBookInput(req.body);
        if(error) {          
            logger.log({
                level: 'error',
                message: error.details[0].message,
                time: new Date()
              }); 
           return res.status(400).send({
            data : error.details[0].message,
            status : 'fail'
        });
        }
        else {           
            var book = await bookBusiness.createBook(req.body);
            if(book.error) {
                logger.log({
                    level: 'error',
                    message: book.error,
                    time: new Date()
                  });
                  
                return res.status(400).send({
                    data : book.error,
                    status : 'fail'
                });
            }
            res.send({
                data : book,
                status : 'success'
            })
        }
    }
    catch(err) {
       // console.log(err);    
       logger.log({
        level: 'error',
        message: err,
        time: new Date()
      });    
        res.status(500).send({
            data : err,
            status : 'fail'
        });
    }
  });

  router.put('/update/:id', async(req, res) => {
    try {
        var {error} = bookBusiness.invalidBookInput(req.body);
        if(error) {        
            logger.log({
                level: 'error',
                message: error.details[0].message,
                time: new Date()
              });  
           return res.status(400).send({
            data : error.details[0].message,
            status : 'fail'
        });
        }
        else {
            var id = req.params.id;
            var existingId = await bookBusiness.validateBookId(id);
            if(existingId) {
                var book = await bookBusiness.updateBook(req.params.id, req.body);
                if(book.error) {
                    logger.log({
                        level: 'error',
                        message: book.error,
                        time: new Date()
                      });

                    return res.status(400).send({
                        data : book.error,
                        status : 'fail'
                    });
                }
                res.send({
                    data : book,
                    status : 'success'
                })
            }
            else {
                logger.log({
                    level: 'error',
                    message: "Invalid book id",
                    time: new Date()
                  });
                 res.status(400).send({
                    data : 'Invalid book id',
                    status : 'fail'
                }); 
                 return;
            }

        }
    }
    catch(err) {
        logger.log({
            level: 'error',
            message: err,
            time: new Date()
          });
        res.status(500).send({
            data : err,
            status : 'fail'
        });
    }
  });



  module.exports = router;