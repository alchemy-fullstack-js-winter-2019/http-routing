const request = require('supertest');
const app = require('../lib/app');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');

describe('app tests', () => {
  beforeEach((done) => {
    rimraf('./testData/store', err => {
      done(err);
    });
  });

  beforeEach((done) => {
    mkdirp('./testData/store', err => {
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
});
