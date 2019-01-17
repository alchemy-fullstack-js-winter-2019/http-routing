const request = require('supertest');
const app = require('../lib/app');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');

const createPerson = name => {
  return request(app)
    .post('/people')
    .send({
      name: name,
      age: 100,
      favoriteColor: 'red'
    });
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
        name: 'Uncle Bob',
        age: 100,
        favoriteColor: 'red'
      })
      .then(res => {
        expect(res.body).toEqual({
          name: 'Uncle Bob',
          age: 100,
          favoriteColor: 'red',
          _id: expect.any(String) 
        });
      });
  });
  it('returns all people', () => {
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
    return createPerson('Tyler')
      .then(({ body }) => {
        return request(app)
          .get(`/people/${body._id}`)
          .then(res => {
            expect(res.body._id).toEqual(body._id);
          });
      });
  });
  it('updates a person by id', () => {
    return createPerson('Tyler')
      .then(({ body }) => {
        return request(app)
          .put(`/people/${body._id}`)
          .send({
            name: body.name,
            age: body.age,
            favoriteColor: 'green',
            _id: body._id
          })
          .then(res => {
            expect(res.body).toEqual({
              name: 'Tyler',
              age: 100,
              favoriteColor: 'green',
              _id: res.body._id
            });
          });
      });
  });
  it('deletes a person by id and returns delete count', () => {
    return createPerson('Connor')
      .then(({ body }) => {
        return request(app)
          .delete(`/people/${body._id}`)
          .then(res => {
            expect(res.body).toEqual({ deleted: 1 });
          });
      });
  });
});

describe('tweets tests', () => {
    it('')
});


