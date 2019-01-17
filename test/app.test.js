const app = require('../lib/app');
const request = require('supertest');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');

const createPerson = (name) => {
  return request(app)
    .post('/people')
    .send({
      name: name,
      age: 31,
      favoriteColor: 'Blue',
      _id: expect.any(String)
    })
    .then(res => res.body);
};

describe('app', () => {
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
        name: 'Aaron',
        age: 31,
        favoriteColor: 'Blue'
      })
      .then(res => {
        expect(res.body).toEqual({
          name: 'Aaron',
          age: 31,
          favoriteColor: 'Blue',
          _id: expect.any(String)
        });
      });
  });

  it('gets a list of all people', () => {
    return Promise.all(['Aaron1', 'Aaron2', 'Aaron3', 'Aaron4', 'Aaron5'].map(name => {
      return createPerson(name);
    }))
      .then(() => {
        return request(app)
          .get('/people');
      })
      .then(({ body }) => {
        expect(body).toHaveLength(5);
      });
  });

  it('gets a single person by id', () => {
    return createPerson('Pete')
      .then(createdPerson => {
        const id = createdPerson._id;
        return request(app)
          .get(`/people/${id}`);
      })
      .then(res => {
        expect(res.body.name).toContain('Pete');
      });
  });

  it('finds and updates a single person by id', () => {
    return createPerson('Peter')
      .then(createdPerson => {
        const id = createdPerson._id;
        createdPerson.name = 'Peter2';
        return request(app)
          .put(`/people/${id}`)
          .send(createdPerson);
      })
      .then(res => {
        expect(res.body.name).toEqual('Peter2');
      });
  });

  it('finds and deletes a person by id', () => {
    return createPerson('Peter')
      .then(createdPerson => {
        const id = createdPerson._id;
        return request(app)
          .delete(`/people/${id}`);
      })
      .then(res => {
        expect(res.body).toEqual({ 'deleted': 1 });
      });
  });
});
