const request = require('supertest');
const app = require('../lib/app');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');

const createTweet = (handle) => {
  return request(app)
    .post('/tweets')
    .send({ 
      handle: handle,
      tweet: 'test tweet'
    })
    .then(res => res.body);
};

describe('tweets tests', () => {
  beforeEach((done) => {
    rimraf('./data/tweets', err => {
      done(err);
    });
  });

  beforeEach((done) => {
    mkdirp('./data/tweets', err => {
      done(err);
    });
  });

  it('creates a tweet', () => {
    return request(app)
      .post('/tweets')
      .send({ 
        handle: 'sk@8trgrl',
        tweet: 'longboarding life yo'
      })
      .then(res => {
        expect(res.body).toEqual({
          handle: 'sk@8trgrl',
          tweet: 'longboarding life yo',
          _id: expect.any(String)
        });
      });
  });

  it('can list all the tweets in the database', () => {
    const handles = ['kristin1', 'kristin2', 'kristin3', 'kristin4'];
    return Promise.all(handles.map(createTweet))
      .then(() => {
        return request(app)
          .get('/tweets');
      })
      .then(({ body }) => {
        expect(body).toHaveLength(4);
      });
  });

  it('gets a tweet by id', () => {
    return createTweet('kristin1')
      .then((createdTweet) => {
        const id = createdTweet._id;
        return request(app)
          .get(`/tweets/${id}`);
      })
      .then(res => {
        expect(res.body.handle).toContain('kristin1');
      });
  });

  it('updates a tweet with :id and returns the update', () => {
    return createTweet('kristin1')
      .then((createdTweet) => {
        const id = createdTweet._id;
        const updatedObject = {
          handle: 'roxius',
          tweet: 'some tweet'
        };
        return request(app)
          .put(`/tweets/${id}`)
          .send(updatedObject)
          .then(() => {
            return request(app)
              .get(`/tweets/${id}`)
              .then(res => {
                expect(res.body.handle).toContain('roxius');
              });
          });
      });
  });

  it('deletes a tweet with :id and returns the delete count', () => {
    return createTweet('kristin1')
      .then((createdTweet) => {
        const id = createdTweet._id;
        return request(app)
          .delete(`/tweets/${id}`)
          .then(res => {
            expect(res.body).toEqual({ 'deleted': 1 });
          });
      });
  });
});

