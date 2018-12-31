var path = require('path');
const _ = require('lodash');
const express = require('express');
const authorBusiness = require(path.join(__dirname, '../business/authorsBusiness'));
var {logger} = require('../logger');

 

const router = express.Router();

router.get('/', async(req, res) => {
    try {
        var auth = await authorBusiness.getAuthors();
        res.send({
            data : auth,
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
        var existingId = await authorBusiness.validateAuthorId(id);
        if(existingId) {
            var auth = await authorBusiness.getAuthorById(id);
            res.send({
                data : auth,
                status : 'success'
            });
        }
        else {
            logger.log({
                level: 'error',
                message: 'Invalid author id',
                time: new Date()
              });
             res.status(400).send({
                data : 'Invalid author id',
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
        var auth = await authorBusiness.searchAuthors(req.body);
        res.send({
            data : auth,
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
 var {e} = await authorBusiness.deleteAuthor(req.params.id);
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
        var {error} = authorBusiness.invalidAuthorInput(req.body);
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
            var auth = await authorBusiness.createAuthor(req.body);
            res.send({
                data : auth,
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
        var {error} = authorBusiness.invalidAuthorInput(req.body);
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
            var existingId = await authorBusiness.validateAuthorId(id);
            if(existingId) {
                var auth = await authorBusiness.updateAuthor(req.params.id, req.body);
                res.send({
                    data : auth,
                    status : 'success'
                })
            }
            else {
                logger.log({
                    level: 'error',
                    message: 'Invalid author id',
                    time: new Date()
                  });
                 res.status(400).send({
                    data : 'Invalid author id',
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