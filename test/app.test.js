const request = require('supertest');
const app = require('../lib/app');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');

const createPerson = name => {
  return request(app)
    .post('/people')
    .send({
      name: name,
      age: 100,
      favoriteColor: 'red'
    });
};

const createTweet = (handle, message) => {
  return request(app)
    .post('/tweets')
    .send({
      handle: handle,
      message: message
    });
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
        name: 'Uncle Bob',
        age: 100,
        favoriteColor: 'red'
      })
      .then(res => {
        expect(res.body).toEqual({
          name: 'Uncle Bob',
          age: 100,
          favoriteColor: 'red',
          _id: expect.any(String) 
        });
      });
  });
  it('returns all people', () => {
    const namesToCreate = ['ryan', 'ryan1', 'ryan2', 'ryan3'];
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
    return createPerson('Tyler')
      .then(({ body }) => {
        return request(app)
          .get(`/people/${body._id}`)
          .then(res => {
            expect(res.body._id).toEqual(body._id);
          });
      });
  });
  it('updates a person by id', () => {
    return createPerson('Tyler')
      .then(({ body }) => {
        return request(app)
          .put(`/people/${body._id}`)
          .send({
            name: body.name,
            age: body.age,
            favoriteColor: 'green',
            _id: body._id
          })
          .then(res => {
            expect(res.body).toEqual({
              name: 'Tyler',
              age: 100,
              favoriteColor: 'green',
              _id: res.body._id
            });
          });
      });
  });
  it('deletes a person by id and returns delete count', () => {
    return createPerson('Connor')
      .then(({ body }) => {
        return request(app)
          .delete(`/people/${body._id}`)
          .then(res => {
            expect(res.body).toEqual({ deleted: 1 });
          });
      });
  });
});

describe('tweets tests', () => {
  beforeEach(done => {
    rimraf('./data/tweets', err => {
      done(err);
    });
  });
  beforeEach(done => {
    mkdirp('./data/tweets', err => {
      done(err);
    });
  });

  it('make a tweet and send back as JSON', () => {
    return request(app)
      .post('/tweets')
      .send({
        handle: 'tylercorbett',
        message: 'Ryan is secretly a robot'
      })
      .then(res => {
        expect(res.body).toEqual({
          handle: 'tylercorbett',
          message: 'Ryan is secretly a robot',
          _id: expect.any(String) 
        });
      });
  });
  it('returns all tweets saved', () => {
    const tweetsToMake = [{
      handle: 'tylercorbett',
      message: 'Ryan is secretly a robot'
    }, 
    {
      handle: 'tylercorbett',
      message: 'Top 3 robots of all time: 3. The Iron Giant 2. Wall E 1. Ryan'
    }];
    return Promise.all(tweetsToMake.map(createTweet))
      .then(() => {
        return request(app)
          .get('/tweets');
      })
      .then(({ body }) => {
        expect(body).toHaveLength(2);
      });
  });
  it('returns a tweet by id', () => {
    return createTweet('tylerIsCool', 'I hear that Tyler is cool')
      .then(({ body }) => {
        return request(app)
          .get(`/tweets/${body._id}`)
          .then(res => {
            expect(res.body._id).toEqual(body._id);
          });
      });
  });
});


