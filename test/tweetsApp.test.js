const request = require('supertest');
const app = require('../lib/app');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');

const createTweet = handle => {
  return request(app)
    .post('/tweets')
    .send({
      handle: handle,
      tweet: ''
    })
    .then(res => res.body);
};
describe('tweets', () => {
  beforeEach(done => {
    rimraf('./data/tweets', done);
  })

  beforeEach(done => {
    mkdirp('./data/tweets', done);
  })

  it('creates a tweet', () => {
    return request(app)
      .post('/tweets')
      .send({
        handle: 'TA',
        tweet: 'My first tweet'
      })
      .then(res => {
        expect(res.body).toEqual({
          handle: 'TA',
          tweet: 'My first tweet',
          _id: expect.any(String)
        })
      })
  })
  it('gets a list of all the tweets', () => {
    const handles = ['TA1', 'TA2', 'TA3', 'TA4'];
    return Promise.all(handles.map(createTweet))
      .then(() => {
        return request(app)
          .get('/tweets')
      })
      .then(({ body }) => {
        expect(body).toHaveLength(4);
      })
  })
  it('gets a tweet by id', () => {
    return createTweet('T_on_A')
      .then(createdTweet => {
        const id = createdTweet._id;
        return request(app)
          .get(`/tweets/${id}`)
      })
      .then(res => {
        expect(res.body.handle).toEqual('T_on_A');
      })
  })
  it('updates by id', () => {
    return createTweet('TT')
      .then(createdTweet => {
        const id = createdTweet._id;
        return request(app)
          .put(`/tweets/${id}`)
          .send({
            handle: 'TA',
            tweet: 'My second tweet',
            _id: id
          })
          .then(() => {
            return request(app)
              .get(`/tweets/${id}`)
              .then(res => {
                expect(res.body).toEqual({
                  handle: 'TA',
                  tweet: 'My second tweet',
                  _id: id
                })
              })
          })
      })
  })
  it('deletes by id', () => {
    return createTweet('deletedTweet')
      .then(createdTweet => {
        const id = createdTweet._id;
        return request(app)
          .delete(`/tweets/${id}`)
      })
      .then(res => {
        expect(res.body).toEqual({ deleted: 1 })
      })
  })
})