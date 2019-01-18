const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const request = require('supertest');
const app = require('../lib/app');

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

  const createPerson = name => {
    return request(app)
      .post('/people')
      .send({
        name,
        age: 30,
        favoriteColor: 'red'
      })
      .then(res => res.body);
  };

  it('creates a person', () => {
    return request(app)
      .post('/people')
      .send({
        name: 'Vic Demise',
        age: 30,
        favoriteColor: 'red'
      })
      .then(res => {
        expect(res.body).toEqual({
          name: 'Vic Demise',
          age: 30,
          favoriteColor: 'red',
          _id: expect.any(String)
        });
      });
  });

  it('gets a list of people from our db', () => {
    const namesToCreate = ['Robin D Cradle', 'Saul Goodman', 'Jay Qarry', 'Michael Deadhands'];
    return Promise.all(namesToCreate.map(createPerson))
      .then(() => {
        return request(app)
          .get('/people');
      })
      .then(({ body }) => {
        expect(body).toHaveLength(4);
      });
  });

  it('finds a user by ID', () => {
    return createPerson('Vic Demise')
      .then(({ _id }) => {
        return Promise.all([
          Promise.resolve(_id),
          request(app).get(`/people/${_id}`)
        ]);
      })
      .then(([_id, { body }]) => {
        expect(body).toEqual({
          name: 'Vic Demise',
          age: 30,
          favoriteColor: 'red',
          _id
        });
      });
  });

  it('updates a person with id and returns the update', () => {
    return createPerson('Vic Demise')
      .then (createdPerson => {
        return request(app)
          .put(`/people/${createdPerson._id}`)
          .send ({ name: 'Pierce Deerhart' });
      })
      .then (res => {
        expect(res.createPerson.name).toEqual('Pierce Deerhart');
      });
  });


});
