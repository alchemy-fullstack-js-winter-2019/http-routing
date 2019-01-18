const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const request = require('supertest');
const app = require('../lib/app');

const createPerson = (name, age = 10) => {
  return request(app)
    .post('/people')
    .send({
      name,
      age: age,
      favoriteColor: 'gold'
    })
    .then(res => res.body);
};
const createPuppy = (name, age = 1) => {
  return request(app)
    .post('/puppies')
    .send({
      name,
      age: age,
      favoriteColor: 'gold'
    })
    .then(res => res.body);
};

describe('app tests', () => {
  beforeAll(done => {
    rimraf('./data/people', done);
    rimraf('./data/puppies', done);
  });
  beforeEach(done => {
    mkdirp('./data/people', done);
    mkdirp('./data/puppies', done);
  });

  // afterAll(done => {
  //   createPerson('booboo face');
  //   done();
  //   createPuppy('taco');
  //   done();
  // });

  it('creates a person', () => {
    return request(app)
      .post('/people')
      .send({
        name: 'Steve Jobs',
        age: 10,
        favoriteColor: 'green'
      })
      .then(res => {
        expect(res.body).toEqual({
          name: 'Steve Jobs',
          age: 10,
          favoriteColor: 'green',
          _id: expect.any(String)
        });
      });
  });
  it('creates a puppy', () => {
    return request(app)
      .post('/puppies')
      .send({
        name: 'snacktime',
        age: 1,
        favoriteColor: 'poo'
      })
      .then(res => {
        expect(res.body).toEqual({
          name: 'snacktime',
          age: 1,
          favoriteColor: 'poo',
          _id: expect.any(String)
        });
      });
  });

  // it('gets a list of people from our db', () => {
  //   const namesToCreate = ['cari', 'cari1', 'cari2', 'cari3'];
  //   return Promise.all(namesToCreate.map(createPerson))
  //     .then(() => {
  //       return request(app)
  //         .get('/people');
  //     })
  //     .then(({ body }) => {
  //       expect(body).toHaveLength(4);
  //     });
  // });

  // it('gets a person by id', () => {
  //   return createPerson('cari')
  //     .then(personWhoWasCreated => {
  //       const _id = personWhoWasCreated._id;
  //       return request(app)
  //         .get(`/people/${_id}`)
  //         .then(res => {
  //           expect(res.body).toEqual({
  //             name: 'cari',
  //             age: 10,
  //             favoriteColor: 'gold',
  //             _id
  //           });
  //         });
  //     });
  // });

  // it('updates a person with :id and returns the update', () => {
  //   let newPerson = {
  //     name: 'steve',
  //     age: 40,
  //     favoriteColor: 'blue'
  //   };
  //   return createPerson('cari')
  //     .then(createdPerson => {
  //       const _id = createdPerson._id;
  //       return request(app)
  //         .put(`/people/${_id}`)
  //         .send(newPerson);
  //     })
  //     .then(res => {
  //       expect(res.body.name).toEqual('steve');
  //     });
  // });

  // it('can delete a person with :id and returns the delete count', () => {
  //   return createPerson('carl')
  //     .then(personWhoWasCreated => {
  //       const _id = personWhoWasCreated._id;
  //       return request(app)
  //         .delete(`/people/${_id}`)
  //         .then(res => {
  //           expect(res.body).toEqual({ deleted: 1 });
  //         });
  //     });
  // });

});
