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
      favoriteFood: 'bacon'
    })
    .then(res => res.body);
};

describe('app tests', () => {
  // beforeAll(done => {
  //   rimraf('./data/people/*', done);
  //   rimraf('./data/puppies/*', done);
  // });
  beforeAll(done => {
    createPerson('sam');
    createPuppy('stinker');
    mkdirp('./data/people', done);
    mkdirp('./data/puppies', done);
    done();
  });
  afterEach(done => {
    rimraf('./data/people/*', done);
    rimraf('./data/puppies/*', done);
    done();
  });
  afterAll(done => {
    createPerson('sam');
    createPuppy('stinker');
    done();
  });

  // CREATE
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
        favoriteFood: 'poo'
      })
      .then(res => {
        expect(res.body).toEqual({
          name: 'snacktime',
          age: 1,
          favoriteFood: 'poo',
          _id: expect.any(String)
        });
      });
  });

  // GET LIST
  it('gets a list of people from our db', () => {
    const namesToCreate = ['cari', 'cari1', 'cari2', 'cari3'];
    return Promise.all(namesToCreate.map(createPerson))
      .then(() => {
        return request(app)
          .get('/people');
      })
      .then(({ body }) => {
        expect(body).toHaveLength(4);
      });
  });
  it('gets a list of puppies from our db', () => {
    const namesToCreate = ['lego', 'ego', 'prego', 'ragu'];
    return Promise.all(namesToCreate.map(createPuppy))
      .then(() => {
        return request(app)
          .get('/puppies');
      })
      .then(({ body }) => {
        expect(body).toHaveLength(4);
      });
  });

  // GET BY ID
  it('gets a person by id', () => {
    return createPerson('cari')
      .then(personWhoWasCreated => {
        const _id = personWhoWasCreated._id;
        return request(app)
          .get(`/people/${_id}`)
          .then(res => {
            expect(res.body).toEqual({
              name: 'cari',
              age: 10,
              favoriteColor: 'gold',
              _id
            });
          });
      });
  });
  it('gets a puppy by id', () => {
    return createPuppy('tortilla')
      .then(puppyWhoWasCreated => {
        const _id = puppyWhoWasCreated._id;
        return request(app)
          .get(`/puppies/${_id}`)
          .then(res => {
            expect(res.body).toEqual({
              name: 'tortilla',
              age: 1,
              favoriteFood: 'bacon',
              _id
            });
          });
      });
  });

  // PUT
  it('updates a person with :id and returns the update', () => {
    let newPerson = {
      name: 'steve',
      age: 40,
      favoriteColor: 'blue'
    };
    return createPerson('cari')
      .then(createdPerson => {
        const _id = createdPerson._id;
        return request(app)
          .put(`/people/${_id}`)
          .send(newPerson);
      })
      .then(res => {
        expect(res.body.name).toEqual('steve');
      });
  });
  it('updates a puppy with :id and returns the update', () => {
    let newPuppy = {
      name: 'umbro',
      age: 2,
      favoriteFood: 'kibble'
    };
    return createPuppy('umbro')
      .then(createdPuppy => {
        const _id = createdPuppy._id;
        return request(app)
          .put(`/puppies/${_id}`)
          .send(newPuppy);
      })
      .then(res => {
        expect(res.body.name).toEqual('umbro');
      });
  });


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
