/* eslint-disable no-console */
const app = require('../lib/app');
const mkdirp = require('mkdirp');
const request = require('supertest');
const rimraf = require('rimraf');

const makePerson = (name) => {
  return request(app)
    .post('/people')
    .send({
      name: name,
      job: 'web developer',
      pets: 'Kaiya & Kingsly'
    })
    .then(res => res.body);
};

describe('app tests', () => {
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
        pets: 'Kaiya & Kingsly'
      })
      .then(res => {
        expect(res.body).toEqual({
          name: 'Kate Dameron',
          job: 'web developer',
          pets: 'Kaiya & Kingsly',
          _id: expect.any(String)
        });
      });
  });

  it('get a list of people from our db', () => {
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
        console.log('PERSON CREATED', personMade);
        return request(app)
          .get(`/people/${id}`);
      })
      .then(res => {
        console.log('RES', res);
        expect(res.body).toEqual({
          name: 'Kate4',
          job: 'web developer',
          pets: 'Kaiya & Kingsly',
          _id: expect.any(String)
        });
      });
  });
});
