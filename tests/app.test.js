const request = require('supertest');
const app = require('../lib/app');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');

describe('app tests', () => {
  // beforeEach(done => {
  //   rimraf('./data/people', err => {
  //     done(err);
  //   });
  // });

  // beforeEach(done => {
  //   mkdirp('./data/people', err => {
  //     done(err);
  //   });
  // });

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
});
