const app = require('../lib/app');
const request = require('supertest');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');

const createDog = (breed) => {
  return request(app)
    .post('/dogs')
    .send({
      breed,
      name: 'pig'
    });
};

describe('dogs', () => {
  beforeEach(done => {
    rimraf('./data/dogs', err => {
      done(err);
    });
  });

  beforeEach(done => {
    mkdirp('./data/dogs', err => {
      done(err);
    });
  });

  it('creates a dog', () => {
    return request(app)
      .post('/dogs')
      .send({
        breed: 'mastiff',
        name: 'bear'
      })
      .then(({ body }) => {
        expect(body).toEqual({
          breed: 'mastiff',
          name: 'bear',
          _id: expect.any(String)
        });
      });
  });
});
