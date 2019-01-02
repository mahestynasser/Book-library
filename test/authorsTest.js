const expect = require('expect');
const request = require('supertest');
const {app} = require('../server');
const authBus = require('../app/business/authorsBusiness');

var createdId;

describe('Create /Authors', () => {
    it('should create a new Author', (done) => {
      var auth = {name: 'unit test author'}
  
      request(app)
        .post('/authors/create')
        .send(auth)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.name).toBe(auth.name);
          createdId = res.body.data.id;
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
  
          authBus.getAuthorById(res.body.data.id).then((auth) => {
            expect(auth).toBeTruthy();
            done();
          }).catch((e) => done(e));
        });
    });
  
    it('should not create a duplicate author', (done) => {
      request(app)
        .post('/authors/create')
        .send({name: 'Ahmad Stanton'})
        .expect(400)
        .expect((res) =>{
          expect(res.body.status).toBe('fail');
        })
        .end(done);
    });

    it('should not create an author without a name', (done) => {
      request(app)
        .post('/authors/create')
        .send({})
        .expect(400)
        .expect((res) =>{
          expect(res.body.status).toBe('fail');
        })
        .end(done);
    });

    it('should not create an author with wrong input format', (done) => {
      request(app)
        .post('/authors/create')
        .send({name : 123, jobTitle: 2, bio: 1})
        .expect(400)
        .expect((res) =>{
          expect(res.body.status).toBe('fail');
        })
        .end(done);
    });
});

describe('Update /Authors', () => {
    it('should Update Author', (done) => {
      var auth = {name: 'test name updated author'}
  
      request(app)
        .put('/authors/update/9306e853-328c-41fe-b882-9661160208df')
        .send(auth)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.name).toBe(auth.name);
        })
        .end(done);
    });
  
    it('should not update an author with an existing name', (done) => {
      request(app)
      .put('/authors/update/9306e853-328c-41fe-b882-9661160208df')
        .send({name : 'Ahmad Stanton'})
        .expect(400)
        .expect((res) =>{
          expect(res.body.status).toBe('fail');
        })
        .end(done);
    });

    it('should not update an author without a name', (done) => {
      request(app)
      .put('/authors/update/9306e853-328c-41fe-b882-9661160208df')
        .send({})
        .expect(400)
        .expect((res) =>{
          expect(res.body.status).toBe('fail');
        })
        .end(done);
    });

    it('should not update an author with wrong input format', (done) => {
      request(app)
      .put('/authors/update/9306e853-328c-41fe-b882-9661160208df')
        .send({name : 123, jobTitle: 2, bio: 1})
        .expect(400)
        .expect((res) =>{
          expect(res.body.status).toBe('fail');
        })
        .end(done);
    });

    it('should not accept a wrong id', (done) => {

        request(app)
        .put('/authors/update/1')
        .send({name : 'a'})
        .expect(400)
        .expect((res) =>{
          expect(res.body.status).toBe('fail');
        })
        .end(done);
      });
});

describe('Delete /Authors', () => {
    it('should delete an author with no relations and a valid id', (done)=> {
      request(app)
      .delete(`/authors/${createdId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toBe(createdId);
        expect(res.body.status).toBe('success');
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        authBus.getAuthorById(createdId).then((res) => {
          expect(res).toNotExist();
          done();
        }).catch((e) => done(e));
      });
    });

    
    it('should return 400 if author id is not valid', (done) => {
      var id = 1;

      request(app)
        .delete(`/authors/${id}`)
        .expect(400)
        .end(done);
    });

    it('should should not delete an author that has a relation', (done) => {

      request(app)
        .delete(`/authors/1c6242f5-476d-4c6a-9f1b-a2fc0f38b106`)
        .expect(400)
        .end(done);
    });

});
 
describe('GET /Authors', () => {
    it('should get all the authors', (done)=> {

      request(app)
      .get('/authors/')
      .expect(200)
      .end(done);
    });

    it('should get authors filtered, paged and sorted', (done) => {

      request(app)
      .post('/authors/search')
      .send({
        sort : 
        {values : 
        ['name']},
        paging :
        {index : 3,
        number : 3}})
        .expect(200)
        .end(done);
    });

    it('should get an author by its id', (done) => {

      var id = '618fc680-5bd3-4668-85be-aa89aff79aa1';
      request(app)
      .get(`/authors/${id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.data.id).toBe(id);
      })
      .end(done);
    });

    it('should return 400 for invalid id', (done)=> {
        var id = 1;
  
        request(app)
          .get(`/authors/${id}`)
          .expect(400)
          .end(done);
  
      });
});