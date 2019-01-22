const app = require('../lib/routes/people');
const request = require('supertest');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');

const createPerson = (name) => {
  return request(app)
    .post('/people')
    .send({
      name: name,
      age: '100',
      favoriteColor: 'red',
      favoriteCharacterId: 1
    });
};

describe.only('people', () => {
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
      .then((res) => {
        const response = JSON.parse(res.text);
        expect(response).toEqual({
          name: 'Uncle Bob',
          age: '100',
          favoriteColor: 'red',
          _id: expect.any(String)
        });
      });
  });

  it('can get a list of people from our db', () => {
    const namesToCreate = ['paige', 'bob', 'jim', 'frank', 'billy'];
    return Promise.all(namesToCreate.map(createPerson))
      .then(() => {
        return request(app)
          .get('/people');
      })
      .then(({ body }) => {
        expect(body).toHaveLength(5);
      });
  });

  it.only('can get a person by id', () =>{
    return createPerson('boohbah')
      .then(({ body }) => {
        return request(app)
          .get(`/people/${body._id}`);
      })
      .then(({ body }) => {
        expect(body).toEqual({
          name: 'boohbah',
          age: '100',
          favoriteColor: 'red',
          _id: expect.any(String),
          favoriteCharacter: {
            name: 'Luke Skywalker',
            hairColor: 'blond',
            height: '172',
            mass: '77'
          }
        });
      });
  });

  it('can find by id and update', () => {
    return createPerson('boohbah')
      .then(({ body }) => {
        return request(app)
          .put(`/people/${body._id}`);
      })
      .then(({ body }) => {
        return Promise.all([
          Promise.resolve(body._id),
          request(app)
            .get(`/people/${body._id}`, () => {
            })
        ]);
      })
      .then(([_id, { body }]) => {
        expect(body).toEqual({
          name: 'banana',
          age: '20',
          favoriteColor: 'blue',
          _id
        });
      });
  });

  it('can delete a person', () => {
    return createPerson('jello')
      .then(({ body }) => {
        return request(app)
          .delete(`/people/${body._id}`);
      })
      .then(({ body }) => {
        expect(body).toEqual({ deleted: 1 });
      });
  });
});
