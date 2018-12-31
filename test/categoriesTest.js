const expect = require('expect');
const request = require('supertest');
const {app} = require('../server');
const catBus = require('../app/business/categoriesBusiness');

var createdId;


describe('Create /Categories', () => {
    it('should create a new Category', (done) => {
      var cat = {name: 'test category'}
  
      request(app)
        .post('/categories/create')
        .send(cat)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.name).toBe(cat.name);
          createdId = res.body.data.id;
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
  
          catBus.getCategoryById(res.body.data.id).then((cat) => {
            expect(cat).toBeTruthy();
            done();
          }).catch((e) => done(e));
        });
    });
  
      it('should not create a category without a name', (done) => {
        request(app)
          .post('/categories/create')
          .send({})
          .expect(400)
          .expect((res) =>{
            expect(res.body.status).toBe('fail');
          })
          .end(done);
      });

      it('should not create a category with wrong input format', (done) => {
        request(app)
          .post('/categories/create')
          .send({name : 123})
          .expect(400)
          .expect((res) =>{
            expect(res.body.status).toBe('fail');
          })
          .end(done);
      });
});

describe('Update /Categories', () => {
  it('should update Category', (done) => {
    var cat = {name: 'test update name category'}

    request(app)
      .put('/categories/update/ed8924b3-53a3-4100-9bd2-d5eef0006082')
      .send(cat)
      .expect(200)
      .expect((res) => {
        expect(res.body.data.name).toBe(cat.name);
      })
      .end(done);
  });

    it('should not update a category without a name', (done) => {
      request(app)
      .put('/categories/update/64f31d72-b12e-48f1-89fd-140d21d99aee')
        .send({})
        .expect(400)
        .expect((res) =>{
          expect(res.body.status).toBe('fail');
        })
        .end(done);
    });

    it('should not update a category with wrong input format', (done) => {
      request(app)
      .put('/categories/update/64f31d72-b12e-48f1-89fd-140d21d99aee')
        .send({name : 123})
        .expect(400)
        .expect((res) =>{
          expect(res.body.status).toBe('fail');
        })
        .end(done);
    });

    it('should not accept a wrong id', (done) => {

      request(app)
      .put('/categories/update/1')
      .send({name : 'a'})
      .expect(400)
      .expect((res) =>{
        expect(res.body.status).toBe('fail');
      })
      .end(done);
    });
});
    
    
describe('Delete /Categories', () => {
    it('should delete a category with no relations and a valid id', (done)=> {
      request(app)
      .delete(`/categories/${createdId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toBe(createdId);
        expect(res.body.status).toBe('success');
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        catBus.getCategoryById(createdId).then((res) => {
          expect(res).toNotExist();
          done();
        }).catch((e) => done(e));
      });
    });

    
    it('should return 400 if category id is not valid', (done) => {
      var id = 1;

      request(app)
        .delete(`/categories/${id}`)
        .expect(400)
        .end(done);
    });

    it('should should not delete a category that has a relation', (done) => {

      request(app)
        .delete(`/categories/936dbf5c-f99f-4633-b636-61dc15b0d064`)
        .expect(400)
        .end(done);
    });

});

describe('GET /Categories', () => {
    it('should get all the categories', (done)=> {

      request(app)
      .get('/categories/')
      .expect(200)
      .end(done);
    });

    it('should get categories filtered, paged and sorted', (done) => {

      request(app)
      .post('/categories/search')
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

    it('should get a category by its id', (done) => {

      var id = '16877178-dc27-4fec-babc-8111142cbd2f';
      request(app)
      .get(`/categories/${id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.data.id).toBe(id);
      })
      .end(done);
    });

    it('should return 400 for invalid id', (done)=> {
      var id = 1;

      request(app)
        .get(`/categories/${id}`)
        .expect(400)
        .end(done);

    });

});