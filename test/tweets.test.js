/* eslint-disable no-console */
const app = require('../lib/app');
const mkdirp = require('mkdirp');
const request = require('supertest');
const rimraf = require('rimraf');

const makeTweet = (text) => {
  return request(app)
    .post('/tweets')
    .send({
      handle: 'katerj',
      tweet: text
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

  it('get a list of tweets from db', () => {
    // Promise.all will make sure that all people are return before we move on with the test instead of having to next create>create>create
    return Promise.all(['tweet 1', 'tweet 2', 'tweet 3'].map(tweet => {
      return makeTweet(tweet);
    }))
      .then(() => {
        return request(app)
          .get('/tweets');
      })
      .then(({ body }) => {
        expect(body).toHaveLength(3);
      });
  });

  it('gets a tweet by id', () => {
    return makeTweet('Weeee')
      .then(newTweet => {
        const id = newTweet._id;
        return request(app)
          .get(`/tweets/${id}`);
      })
      .then(res => {
        expect(res.body).toEqual({
          handle: 'katerj',
          tweet: 'Weeee',
          _id: expect.any(String)
        });
      });
  });

  it('gets a tweet by id and updates', () => {
    return makeTweet('update this tweet')
      .then(tweetMade => {
        const id = tweetMade._id;
        return request(app)
          .put(`/tweets/${id}`)
          .send({
            handle: 'katerj',
            tweet: 'update this tweet',
            _id: id
          })
          .then(() => {
            return request(app)
              .get(`/tweets/${id}`)
              .then(res => {
                expect(res.body).toEqual({
                  handle: 'katerj',
                  tweet: 'update this tweet',
                  _id: id
                });
              });
          });
      });
  });

  it('gets a tweet by id and deletes that tweet', () => {
    return makeTweet('delete this tweet')
      .then(tweetToDelete => {
        const id = tweetToDelete._id;
        return request(app)
          .delete(`/tweets/${id}`)
          .then(res => {
            expect(res.body).toEqual({ deleted: 1 });
          });
      });
  });

});
