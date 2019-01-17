const app = require('../lib/app');
const request = require('supertest');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');

const createTweets = (handle) => {
  return request(app)
    .post('/tweets')
    .send({
      handle: handle,
      text: 'Hello',
      _id: expect.any(String)
    })
    .then(res => res.body);
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

  it('creates a tweet', () => {
    return request(app)
      .post('/tweets')
      .send({
        handle: 'Aaron',
        text: 'Hey there'
      })
      .then(res => {
        expect(res.body).toEqual({
          handle: 'Aaron',
          text: 'Hey there',
          _id: expect.any(String)
        });
      });
  });

  it('gets a list of all tweets', () => {
    return Promise.all(['Aaron1', 'Aaron2', 'Aaron3', 'Aaron4', 'Aaron5'].map(handle => {
      return createTweets(handle);
    }))
      .then(() => {
        return request(app)
          .get('/tweets');
      })
      .then(({ body }) => {
        expect(body).toHaveLength(5);
      });
  });

  it('gets a single tweet by id', () => {
    return createTweets('Pete')
      .then(createdTweets => {
        const id = createdTweets._id;
        return request(app)
          .get(`/tweets/${id}`);
      })
      .then(res => {
        expect(res.body.handle).toContain('Pete');
      });
  });

  it('finds and updates a single tweet by id', () => {
    return createTweets('Peter')
      .then(createdTweets => {
        const id = createdTweets._id;
        createdTweets.handle = 'Peter2';
        return request(app)
          .put(`/tweets/${id}`)
          .send(createdTweets);
      })
      .then(res => {
        expect(res.body.handle).toEqual('Peter2');
      });
  });

  it('finds and deletes a tweet by id', () => {
    return createTweets('Peter')
      .then(createdTweets => {
        const id = createdTweets._id;
        return request(app)
          .delete(`/tweets/${id}`);
      })
      .then(res => {
        expect(res.body).toEqual({ 'deleted': 1 });
      });
  });
});
