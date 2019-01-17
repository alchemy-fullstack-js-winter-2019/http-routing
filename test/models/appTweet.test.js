const app = require('../../lib/appTweet');
const request = require('supertest');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf'); 

const createTweet = (name) => {
  return request(app)
    .post('/tweets')
    .send({
      name: name,
      description: 'dogs are the best',
      username: 'allTHEDOGs'
    })
    .then(res => res.body);
};
describe('gets people', () => {
  beforeEach(done => {
    rimraf('./data/tweets', err => {
      done(err);
    });
  });
  beforeEach((done) => {
    mkdirp('./data/tweets', err => {
      done(err);
    });
  });
  // it('gets a tweet', () => {
  //   const tweetsToCreate = ['tweet1', 'tweet2', 'tweet3', 'tweet4'];
  //   return  Promise.all(tweetsToCreate.map(createTweet))
  //     .then(() => {
  //       return request(app)
  //         .get('/tweets');
  //     })
  //     .then(({ body }) => {
  //       expect(body).toHaveLength(4);
  //     });
  // });
  it('makes a tweet', () => {
    return request(app)
      .post('/tweets')
      .send({
        name: 'Mike',
        description: 'dogs are the best',
        username: 'allTHEDOGs'
      })
      .then(res => {
        expect(res.body).toEqual({
          name: 'Mike',
          description: 'dogs are the best',
          username: 'allTHEDOGs',
          _id: expect.any(String)
        });
      });
  });
});

