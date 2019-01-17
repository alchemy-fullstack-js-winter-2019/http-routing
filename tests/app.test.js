const request = require('supertest');
const app = require('../lib/app');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');

const createPerson = (name) => {
  return request(app)
    .post('/people')
    .send({
      name: name,
      age: 80,
      favoriteColor: 'blue'
    })
    .then(res => res.body);
};


describe('app tests', () => {
  beforeEach(done => {
    rimraf('./data/people', err => {
      done(err);
    });
  });

  beforeEach(done => {
    mkdirp('./data/people', err => {
      done(err);
    });
  });

  it('creates a person', () => {
    return request(app)
      .post('/people')
      .send({
        name: 'Uncle bob',
        age: 80,
        favoriteColor: 'blue'
      })
      .then(res => {
        expect(res.body).toEqual({
          name: 'Uncle bob',
          age: 80,
          favoriteColor: 'blue',
          _id: expect.any(String)
        });
      });
  });

  it('gets a list of people from our db', () => {
    const namesToCreate = ['abel', 'abel1', 'abel2', 'abel3'];
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
    const id = personWhoWasCreated._id;
    return createPerson('abel')
      .then(personWhoWasCreated => {
        return request(app)
          .get('/people');
      })
      .then({ body }) => {
        expect(body).toEqual(id)
      }; 
        
  });
});

