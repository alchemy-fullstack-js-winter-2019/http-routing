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
    
  })

})