/* eslint-disable no-console */
const app = require('../../lib/app');
const mkdirp = require('mkdirp');
const request = require('supertest');
const rimraf = require('rimraf');

const makePerson = (name) => {
  return request(app)
    .post('/people')
    .send({
      name: name,
      job: 'web developer',
      pets: 'Kaiya & Kingsley',
      favoriteCharacterId: '1'
    })
    .then(res => res.body);
};

describe('people tests', () => {
  beforeEach(done => {
    // Before each test remove directory so we don't have old test data
    rimraf('./data/people', err => {
      done(err);
    });
  });

  beforeEach(done => {
    // Before each make a new directory to store new test data
    mkdirp('./data/people', err => {
      done(err);
    });
  });

  it('creates a new person', () => {
    return request(app)
      .post('/people')
      .send({
        name: 'Kate Dameron',
        job: 'web developer',
        pets: 'Kaiya & Kingsley',
        favoriteCharacterId: '1'
      })
      .then(res => {
        expect(res.body).toEqual({
          name: 'Kate Dameron',
          job: 'web developer',
          pets: 'Kaiya & Kingsley',
          favoriteCharacterId: '1',
          favoriteCharacter: {
            name: 'Luke Skywalker',
            height: '172',
            mass: '77',
            hair_color: 'blond',
            birth_year: '19BBY' },
          _id: expect.any(String)
        });
      });
  });

  it('get a list of people from db', () => {
    // Promise.all will make sure that all people are return before we move on with the test instead of having to next create>create>create
    return Promise.all(['Kate', 'Kate2', 'Kate3'].map(name => {
      return makePerson(name);
    }))
      .then(() => {
        return request(app)
          .get('/people');
      })
      .then(({ body }) => {
        expect(body).toHaveLength(3);
      });
  });

  it('gets a person by id', () => {
    return makePerson('Kate4')
      .then(personMade => {
        const id = personMade._id;
        return request(app)
          .get(`/people/${id}`);
      })
      .then(res => {
        expect(res.body).toEqual({
          name: 'Kate4',
          job: 'web developer',
          pets: 'Kaiya & Kingsley',
          favoriteCharacterId: '1',
          favoriteCharacter: {
            name: 'Luke Skywalker',
            height: '172',
            mass: '77',
            hair_color: 'blond',
            birth_year: '19BBY' },
          _id: expect.any(String)
        });
      });
  });

  it('gets a person by id and updates', () => {
    return makePerson('Kate5')
      .then(personMade => {
        const id = personMade._id;
        return request(app)
          .put(`/people/${id}`)
          .send({
            name: 'Kate D',
            job: 'developer',
            pets: 'Kaiya and Kingsley',
            favoriteCharacterId: '1',
            favoriteCharacter: {
              name: 'Luke Skywalker',
              height: '172',
              mass: '77',
              hair_color: 'blond',
              birth_year: '19BBY' },
            id: id
          })
          .then(() => {
            return request(app)
              .get(`/people/${id}`)
              .then(res => {
                expect(res.body).toEqual({
                  name: 'Kate D',
                  job: 'developer',
                  pets: 'Kaiya and Kingsley',
                  favoriteCharacter: {
                    name: 'Luke Skywalker',
                    height: '172',
                    mass: '77',
                    hair_color: 'blond',
                    birth_year: '19BBY' },
                  favoriteCharacterId: '1',
                  _id: id
                });
              });
          });
      });
  });

  it('gets a person by id and deletes that person', () => {
    return makePerson('Kate Delete')
      .then(personToDelete => {
        const id = personToDelete._id;
        return request(app)
          .delete(`/people/${id}`)
          .then(res => {
            expect(res.body).toEqual({ deleted: 1 });
          });
      });
  });

});
