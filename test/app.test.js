const app = require('../lib/app');
const request = require('supertest');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');

const createTweet = (handle) => {
  return request(app)
    .post('/tweets')
    .send({
      handle,
      tweet: 'tweet tweet'
    });
};

describe('tweets', () => {
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

  it('creates a tweet!', () => {
    return request(app)
      .post('/tweets')
      .send({
        handle: 'bAnAnAsRcOoL',
        tweet: 'i love bananas'
      })
      .then(({ body }) => {
        expect(body).toEqual({
          handle: 'bAnAnAsRcOoL',
          tweet: 'i love bananas',
          _id: expect.any(String)
        });
      });
  });

  it('can get a list of tweets from our db', () => {
    const tweetsToCreate = ['yoyo', 'jelly123', 'jessie456'];
    return Promise.all(tweetsToCreate.map(createTweet))
      .then(() => {
        return request(app)
          .get('/tweets');
      })
      .then(({ body }) => {
        expect(body).toHaveLength(3);
      });
  });

  it('can get a tweet by id', () => {
    return createTweet('boohbah')
      .then(({ body }) => {
        return request(app)
          .get(`/tweets/${body._id}`);
      })
      .then(({ body }) => {
        expect(body).toEqual({
          handle: 'boohbah',
          tweet: 'tweet tweet',
          _id: expect.any(String)
        });
      });
  });
});
