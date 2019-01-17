const app = require('../../lib/app');
const request = require('supertest');
// const People = require('../lib/models/People');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf'); 

const createPerson = (name) => {
  return request(app)
    .post('/people')
    .send({
      name: name,
      age: '40',
      favoriteColor: 'Periwinkle' 
    })
    .then(res => res.body);
};
describe('gets people', () => {
  beforeEach(done => {
    rimraf('./data/people', err => {
      done(err);
    });
  });
  beforeEach((done) => {
    mkdirp('./data/people', err => {
      done(err);
    });
  });
  it('make a person', () => {
    return request(app)
      .post('/people')
      .send({
        name: 'Jeffery',
        age: '40',
        favoriteColor: 'Periwinkle' 
      })
      .then(res => {
        expect(res.body).toEqual({
          name: 'Jeffery',
          age: '40',
          favoriteColor: 'Periwinkle',
          _id: expect.any(String)
        });
      });
  });
  it('gets a person', () => {
    const namesToCreate = ['marcy1', 'marcy2', 'marcy3', 'marcy4'];
    return  Promise.all(namesToCreate.map(createPerson))
      .then(() => {
        return request(app)
          .get('/people');
      })
      .then(({ body }) => {
        expect(body).toHaveLength(4);
      });
  });
});
