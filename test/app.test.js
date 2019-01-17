const request = require('supertest');
const app = require('../lib/app');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');

const createPerson = (name) => {
  return request(app)
    .post('/people')
    .send({ 
      name: name,
      age: 99,
      favoriteColor: 'black'
    })
    .then(res => res.body);
};

describe('app tests', () => {
  beforeEach((done) => {
    rimraf('./data/people', err => {
      done(err);
    });
  });

  beforeEach((done) => {
    mkdirp('./data/people', err => {
      done(err);
    });
  });

  it('creates a person', () => {
    return request(app)
      .post('/people')
      .send({ 
        name: 'Eminem',
        age: 35,
        favoriteColor: 'black'
      })
      .then(res => {
        expect(res.body).toEqual({
          name: 'Eminem',
          age: 35,
          favoriteColor: 'black',
          _id: expect.any(String)
        });
      });
  });

  it('can list all the people in the database', () => {
    const names = ['kristin1', 'kristin2', 'kristin3', 'kristin4'];
    return Promise.all(names.map(createPerson))
      .then(() => {
        return request(app)
          .get('/people');
      })
      .then(({ body }) => {
        console.log(body);
        expect(body).toHaveLength(4);
      });
    
  });
});
