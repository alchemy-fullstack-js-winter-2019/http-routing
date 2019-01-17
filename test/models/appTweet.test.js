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
  it('gets a tweet', () => {
    const tweetsToCreate = ['tweet1', 'tweet2', 'tweet3', 'tweet4'];
    return  Promise.all(tweetsToCreate.map(createTweet))
      .then(() => {
        return request(app)
          .get('/tweets/');
      })
      .then(({ body }) => {
        expect(body).toHaveLength(4);
      });
  });
  it('gets a tweet by id', () => {
    return createTweet('marcy1')
      .then(TweetWasCreated => {
        const id = TweetWasCreated._id;
        return request(app)
          .get(`/tweets/${id}`);
      })
      .then(res => {
        expect(res.body).toEqual({
          name: 'marcy1',
          description: 'dogs are the best',
          username: 'allTHEDOGs',
          _id: expect.any(String)
        });
      });
  });
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
  it('finds by a tweet by ID and updates', () => {
    return createTweet('marcy1')
      .then(TweetWasCreated => {
        const id = TweetWasCreated._id;
        const updatedObject = ({ name: 'marcy2',
          description: 'dogs are the best',
          username: 'allTHEDOGs',
          _id: expect.any(String) });
        return request(app) 
          .put(`/tweets/${id}`)
          .send(updatedObject)
          .then(res => {
            return request(app)
              .get(`/tweets/${id}`)
              .then(res => {
                expect(res.body).toEqual({
                  name: 'marcy2',
                  description: 'dogs are the best',
                  username: 'allTHEDOGs',
                  _id: id
                });
              });
          });
      });
  });
  it('deletes a tweet', () => {
    return createTweet('marcy1')
      .then(TweetWasCreated => {
        const id = TweetWasCreated._id;
        return request(app)
          .delete(`/tweets/${id}`)
          .then(res => {
            expect(res.status).toEqual(200);
          });
      });
  });
});


