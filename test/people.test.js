const request = require('supertest');
const app = require('../lib/app');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');

const createPerson = (name) => {
  return request(app)
    .post('/people')
    .send({ 
      name: name,
      age: 99,
      favoriteColor: 'black',
      favoriteCharacterId: 1
    })
    .then(res => res.body);
};

describe('people tests', () => {
  beforeEach((done) => {
    rimraf('./data/people', err => {
      done(err);
    });
  });

  beforeEach((done) => {
    mkdirp('./data/people', err => {
      done(err);
    });
  });

  it('creates a person', () => {
    return request(app)
      .post('/people')
      .send({ 
        name: 'Eminem',
        age: 35,
        favoriteColor: 'black',
        favoriteCharacterId: 1
      })
      .then(res => {
        expect(res.body.favoriteCharacter.name).toContain('Luke Skywalker');
      });
  });
 
  it('can list all the people in the database', () => {
    const names = ['kristin1', 'kristin2', 'kristin3', 'kristin4'];
    return Promise.all(names.map(createPerson))
      .then(() => {
        return request(app)
          .get('/people');
      })
      .then(({ body }) => {
        expect(body).toHaveLength(4);
      });
  });

  it('gets a person by id', () => {
    return createPerson('kristin1')
      .then((createdPerson) => {
        const id = createdPerson._id;
        return request(app)
          .get(`/people/${id}`);
      })
      .then(res => {
        expect(res.body.name).toContain('kristin1');
      });
  });

  it('updates a person with :id and returns the update', () => {
    return createPerson('kristin1')
      .then((createdPerson) => {
        const id = createdPerson._id;
        const updatedObject = {
          name: 'roxius',
          age: 99,
          favoriteColor: 'black',
          favoriteCharacterId: 1
        };
        return request(app)
          .put(`/people/${id}`)
          .send(updatedObject)
          .then(() => {
            return request(app)
              .get(`/people/${id}`)
              .then(res => {
                expect(res.body.name).toContain('roxius');
              });
          });
      });
  });
  
  it('deletes a person with :id and returns the delete count', () => {
    return createPerson('kristin1')
      .then((createdPerson) => {
        const id = createdPerson._id;
        return request(app)
          .delete(`/people/${id}`)
          .then(res => {
            expect(res.body).toEqual({ 'deleted': 1 });
          });
      });
  });

});
