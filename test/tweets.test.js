/* eslint-disable no-console */
const app = require('../lib/app');
const mkdirp = require('mkdirp');
const request = require('supertest');
const rimraf = require('rimraf');

const makeTweet = (text) => {
  return request(app)
    .post('/people')
    .send({
      handle: 'katerj',
      tweet: 'Yay, tomorrow is Friday'
    })
    .then(res => res.body);
};

describe('tweets test', () => {
  beforeEach(done => {
    // Before each test remove directory so we don't have old test data
    rimraf('./data/tweets', err => {
      done(err);
    });
  });

  beforeEach(done => {
    // Before each make a new directory to store new test data
    mkdirp('./data/tweets', err => {
      done(err);
    });
  });

  it('creates a new tweet', () => {
    return request(app)
      .post('/tweets')
      .send({
        handle: 'katerj',
        tweet: 'Yay, tomorrow is Friday'
      })
      .then(res => {
        expect(res.body).toEqual({
          handle: 'katerj',
          tweet: 'Yay, tomorrow is Friday',
          _id: expect.any(String)
        });
      });
  });


});
