const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const request = require('supertest');
const app = require('../lib/app');

const createPerson = name => {
  return request(app)
    .post('./people')
    .send({
      name,
      age: 100,
      favoriteColor: 'red'
    })
    .then(res => res.body);
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
        name: 'Uncle bob',
        age: 100,
        favoriteColor: 'red'
      })
      .then(res => {
        expect(res.body).toEqual({
          name: 'Uncle bob',
          age: 100,
          favoriteColor: 'red',
          _id: expect.any(String)
        });
      });
  });

  it('gets a list of people from our db', ()=> {
    const namesToCreate = ['jei', 'jj', 'jbird', 'jroc'];
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
    return createPerson('jei')
      .then(({ _id }) => {
        return Promise.all([
          Promise.resolve(_id),
          request(app).get(`/people/${_id}`)
        ]);
      })
      .then(([_id, { body }]) => {
        expect(body).toEqual({
          name: 'jei',
          age: 40,
          favoriteColor: 'blue',
          _id
        });
      });

    it('can find by id and update', () => {
      return createPerson('jj')
        .then(({ body }) => {
          return request(app)
            .put(`/people/${body._id}`);
        })
        .then(({ body }) => {
          return Promise.all([
            request(app)
              .get(`/people/${body._id}`, () => {
              })
          ]);
        })
        .then(([_id, { body }]) => {
          expect(body).toEqual({
            name: 'jbird',
            age: '99',
            favoriteColor: 'blackheart',
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
});
