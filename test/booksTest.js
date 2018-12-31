const expect = require('expect');
const request = require('supertest');
const {app} = require('../server');
const bookBus = require('../app/business/booksBusiness');

var createdId;


describe('Create /Book', () => {
    it('should create a new Book', (done) => {
      var book = {title: 'test book', author : 'ee878957-83f3-48c4-b899-45dd6c83e926', category : '4964327c-028a-469d-b432-d3b857a10f0d'}
  
      request(app)
        .post('/books/create')
        .send(book)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.title).toBe(book.title);
          createdId = res.body.data.id;
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
  
          bookBus.getBookById(res.body.data.id).then((book) => {
            expect(book).toBeTruthy();
            done();
          }).catch((e) => done(e));
        });
    });
  
    it('should not create a book without a title', (done) => {
      request(app)
        .post('/books/create')
        .send({})
        .expect(400)
        .expect((res) =>{
          expect(res.body.status).toBe('fail');
        })
        .end(done);
    });

describe('Update /Book', () => {
        it('should update Book', (done) => {
          var book = {title: 'test book title updated'}
      
          request(app)
            .put('/books/update/2a8ccee7-2790-47a3-9a22-bfcac09cd6a2')
            .send(book)
            .expect(200)
            .expect((res) => {
              expect(res.body.data.title).toBe(book.title);
            })
            .end(done);
        });
      
        it('should not update a book without a title', (done) => {
          request(app)
          .put('/books/update/2a8ccee7-2790-47a3-9a22-bfcac09cd6a2')
            .send({})
            .expect(400)
            .expect((res) =>{
              expect(res.body.status).toBe('fail');
            })
            .end(done);
        });
    
        it('should not update a book with wrong input format', (done) => {
          request(app)
          .put('/books/update/2a8ccee7-2790-47a3-9a22-bfcac09cd6a2')
            .send({name : 123, jobTitle: 2, bio: 1})
            .expect(400)
            .expect((res) =>{
              expect(res.body.status).toBe('fail');
            })
            .end(done);
        });
    
        it('should not update a book without invalid author id and category id', (done) => {
            request(app)
            .put('/books/update/2a8ccee7-2790-47a3-9a22-bfcac09cd6a2')
              .send({title: 'test book', author : 'ee8', category : '4965d'})
              .expect(400)
              .expect((res) =>{
                expect(res.body.status).toBe('fail');
              })
              .end(done);
          });

          it('should not accept a wrong id', (done) => {

            request(app)
            .put('/books/update/1')
            .send({title : 'a'})
            .expect(400)
            .expect((res) =>{
              expect(res.body.status).toBe('fail');
            })
            .end(done);
          });
    });

    it('should not create a book with wrong input format', (done) => {
      request(app)
        .post('/books/create')
        .send({name : 123, jobTitle: 2, bio: 1})
        .expect(400)
        .expect((res) =>{
          expect(res.body.status).toBe('fail');
        })
        .end(done);
    });

    it('should not create a book without valid author id and category id', (done) => {
        request(app)
          .post('/books/create')
          .send({title: 'test book', author : 'ee8', category : '4965d'})
          .expect(400)
          .expect((res) =>{
            expect(res.body.status).toBe('fail');
          })
          .end(done);
      });
});

describe('Delete /Books', () => {
    it('should delete a valid book', (done)=> {
      request(app)
      .delete(`/books/${createdId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toBe(createdId);
        expect(res.body.status).toBe('success');
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        bookBus.getBookById(createdId).then((res) => {
          expect(res).toNotExist();
          done();
        }).catch((e) => done(e));
      });
    });

    
    it('should return 400 if book id is not valid', (done) => {
      var id = 1;

      request(app)
        .delete(`/books/${id}`)
        .expect(400)
        .end(done);
    });

});

describe('GET /Books', () => {
    it('should get all the books', (done)=> {

      request(app)
      .get('/books/')
      .expect(200)
      .end(done);
    });

    it('should get books filtered, paged and sorted', (done) => {

      request(app)
      .post('/books/search')
      .send({
        sort : 
        {values : 
        ['title']},
        paging :
        {index : 3,
        number : 3}})
        .expect(200)
        .end(done);
    });

    it('should get a book by its id', (done) => {

      var id = 'c7ae9365-3f91-4dca-98d7-2fdfbaf3c169';
      request(app)
      .get(`/books/${id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.data.id).toBe(id);
      })
      .end(done);
    });

    it('should return 400 for invalid id', (done)=> {
        var id = 1;
  
        request(app)
          .get(`/books/${id}`)
          .expect(400)
          .end(done);
  
      });
});


  

  