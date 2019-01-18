const app = require('../../lib/app');
const request = require('supertest');
// const People = require('../lib/models/People');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf'); 

const createDog = (name) => {
  return request(app)
    .post('/dogs')
    .send({
      name: name,
      breed: 'frenchbull dog',
      favoriteColor: 'Periwinkle' 
    })
    .then(res => res.body);
};
describe('gets dog', () => {
  beforeEach(done => {
    rimraf('./data/dogs', err => {
      done(err);
    });
  });
  beforeEach((done) => {
    mkdirp('./data/dogs', err => {
      done(err);
    });
  });
  it('makes a dog', () => {
    return request(app)
      .post('/dogs')
      .send({
        name: 'Cheddar',
        breed: 'frenchbull dog',
        favoriteColor: 'Periwinkle'
      })
      .then(res => {
        expect(res.body).toEqual({
          name: 'Cheddar',
          breed: 'frenchbull dog',
          favoriteColor: 'Periwinkle',
          _id: expect.any(String)
        });
      });
  });
  it('gets all the dogs', () => {
    const namesToDogs = ['pudding', 'gunther', 'pickles', 'beans'];
    return  Promise.all(namesToDogs.map(createDog))
      .then(() => {
        return request(app)
          .get('/dogs');
      })
      .then(({ body }) => {
        expect(body).toHaveLength(4);
      });
  });
  it('gets a dog by id', () => {
    return createDog('pickles')
      .then(DogWasCreated => {
        const id = DogWasCreated._id;
        return request(app)
          .get(`/dogs/${id}`);
      })
      .then(res => {
        expect(res.body).toEqual({
          name: 'pickles',
          breed: 'frenchbull dog',
          favoriteColor: 'Periwinkle',
          _id: expect.any(String)
        });
      });
  });
  it('finds by Id and updates', () => {
    return createDog('pickles')
      .then(DogWasCreated => {
        const id = DogWasCreated._id;
        const updatedObject = ({ name: 'Cheddar',
          breed: 'frenchbull dog',
          favoriteColor: 'Periwinkle',
          _id: expect.any(String) });
        return request(app) 
          .put(`/dogs/${id}`)
          .send(updatedObject)
          /* eslint-disable-next-line*/
          .then(res => {
            return request(app)
              .get(`/dogs/${id}`)
              .then(res => {
                expect(res.body).toEqual({
                  name: 'Cheddar',
                  breed: 'frenchbull dog',
                  favoriteColor: 'Periwinkle',
                  _id: expect.any(String)
                });
              });
          });
      });
  }); 
  it('deletes a dog', () => {
    return createDog('pudding')
      .then(DogWasCreated => {
        const id = DogWasCreated._id;
        return request(app)
          .delete(`/dogs/${id}`)
          .then(res => {
            expect(res.status).toEqual(200);
          });
      });
  });
});

