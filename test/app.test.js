const app = require('../lib/app');
const request = require('supertest');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');

describe('people', () => {
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
        age: '100',
        favoriteColor: 'red'
      })
      .then(res => {
        expect(res.body).toEqual({
          name: 'Uncle Jim',
          age: '100',
          favoriteColor: 'red',
          _id: expect.any(String)
        });
      });
  });
  it('can get all people', () => {
    return request(app)
      .get('/people')
      .then(res => {
        expect(res.body).toContain('Uncle Bob');
      });
  });
});
