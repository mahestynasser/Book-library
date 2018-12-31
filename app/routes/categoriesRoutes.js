var path = require('path');
const _ = require('lodash');
const express = require('express');
const categoryBusiness = require(path.join(__dirname, '../business/categoriesBusiness'));
var {logger} = require('../logger');


const router = express.Router();

router.get('/', async(req, res) => {
    try {
        var categ = await categoryBusiness.getCategories();
        res.send({
            data : categ,
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
        var existingId = await categoryBusiness.validateCategoryId(id);
        if(existingId) {
            var categ = await categoryBusiness.getCategoryById(id);
            res.send({
                data : categ,
                status : 'success'
            });
        }
        else {
            logger.log({
                level: 'error',
                message: 'Invalid category id',
                time: new Date()
              });
             res.status(400).send({
                data : 'Invalid category id',
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
        var categ = await categoryBusiness.searchCategories(req.body);
        res.send({
            data : categ,
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
   var {e} = await categoryBusiness.deleteCategory(req.params.id);
    if(e) {
        logger.log({
            level: 'error',
            message: e,
            time: new Date()
          });
        res.status(400).send({
            data : e,
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

  router.post('/create', async(req, res) => {
    try {
        var {error} = categoryBusiness.invalidCategoryInput(req.body);
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
            var categ = await categoryBusiness.createCategory(req.body);
            res.send({
                data : categ,
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

  router.put('/update/:id', async(req, res) => {
    try {
        var {error} = categoryBusiness.invalidCategoryInput(req.body);
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
            var existingId = await categoryBusiness.validateCategoryId(id);
            if(existingId) {
                var categ = await categoryBusiness.updateCategory(req.params.id, req.body);
                res.send({
                    data : categ,
                    status : 'success'
                })
            }
            else {
                logger.log({
                    level: 'error',
                    message: 'Invalid category id',
                    time: new Date()
                  });
                 res.status(400).send({
                    data : 'Invalid category id',
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

