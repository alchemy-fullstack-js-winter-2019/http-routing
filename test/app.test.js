const request = require('supertest');
const app = require('../lib/routing/people.js');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');

const createPerson = name => {
  return request(app)
    .post('/people')
    .send({
      name,
      age: 100,
      favoriteColor: 'red'
    })
    .then(res => res.body);
};

describe('app tests', () => {
  beforeEach(done => {
    rimraf('./data/people', err => {
      done(err);
    });
  });
  //we dont want our test to finish until this done call back is called unless theres an err, then stop and let us know. 
  beforeEach(done => {
    mkdirp('./data/people', err => {
      done(err);
    });
  });

  it('creates a person', () => {
    //the return lets jest know that it needs to return this promise before moving on. 
    return request(app)
      .post('/people')
      .send({
        name: 'Uncle bob',
        age: 100,
        favoriteColor: 'red'
      })
      .then(res => {
        //PERSONAL NOTE: res.body bc response has several objects and body is the one we work with the most
        expect(res.body).toEqual({
          name: 'Uncle bob',
          age: 100,
          favoriteColor: 'red',
          _id: expect.any(String)
        });
      });
  });

  it('gets a list of people from our db', () => {
    const namesToCreate = ['ryan', 'ryan1', 'ryan2', 'ryan3'];
    
    return Promise.all(namesToCreate.map(createPerson))
      .then(() => {
        return request(app)
          .get('/people');
      })
      
      .then(({ body }) => {
        expect(body).toHaveLength(4);
      });
  });
  it('gets a person by id', () => {
    return createPerson('jon')
      .then(createdPerson => {
        const id = createdPerson._id;
        return request(app)
          .get(`/people/${id}`);
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'jon',
          age: 100,
          favoriteColor: 'red'
        });
      });
  });
  //find by id and update 
  it('find person by id and updates', ()=> {
    return createPerson('juan')
      .then(updated => {
        return request(app)
          .put(`/people/${updated._id}`)
          .send({ name: 'johnny' });
      })
      .then(res => {
        expect(res.body.name).toContain('johnny');
      });   
  });
  it('finds by id and deletes', ()=> {
    return createPerson('pedro')
      .then(createdPerson => {
        return request(app)
          .delete(`/people/${ createdPerson._id }`);
      })
      .then(res=>{
        expect(res.body).toEqual({ deleted: 1 });
      });
  });
  it.only('Responds with Nada', ()=> {
    return request(app)
      .get('/other')
      .then(res => {
        expect(res.statusCode).toEqual(404);
      });
  });
  

});



