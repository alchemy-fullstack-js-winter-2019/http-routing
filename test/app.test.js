const request = require('supertest');
const app = require('../lib/app');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');

const createPerson = (name) => {
  return request(app)
    .post('/people')
    .send({ 
      name: name,
      age: 99,
      favoriteColor: 'black'
    })
    .then(res => res.body);
};

const createTweet = (handle) => {
  return request(app)
    .post('/tweets')
    .send({ 
      handle: handle,
      tweet: 'test tweet'
    })
    .then(res => res.body);
};

describe('app tests', () => {
  beforeEach((done) => {
    rimraf('./data/people', err => {
      done(err);
    });
  });

  beforeEach((done) => {
    rimraf('./data/tweets', err => {
      done(err);
    });
  });

  beforeEach((done) => {
    mkdirp('./data/people', err => {
      done(err);
    });
  });

  beforeEach((done) => {
    mkdirp('./data/tweets', err => {
      done(err);
    });
  });

  it('creates a person', () => {
    return request(app)
      .post('/people')
      .send({ 
        name: 'Eminem',
        age: 35,
        favoriteColor: 'black'
      })
      .then(res => {
        expect(res.body).toEqual({
          name: 'Eminem',
          age: 35,
          favoriteColor: 'black',
          _id: expect.any(String)
        });
      });
  });

  it('can list all the people in the database', () => {
    const names = ['kristin1', 'kristin2', 'kristin3', 'kristin4'];
    return Promise.all(names.map(createPerson))
      .then(() => {
        return request(app)
          .get('/people');
      })
      .then(({ body }) => {
        console.log(body);
        expect(body).toHaveLength(4);
      });
  });

  it('gets a person by id', () => {
    return createPerson('kristin1')
      .then((createdPerson) => {
        const id = createdPerson._id;
        return request(app)
          .get(`/people/${id}`);
      })
      .then(res => {
        expect(res.body.name).toContain('kristin1');
      });
  });

  it('updates a person with :id and returns the update', () => {
    return createPerson('kristin1')
      .then((createdPerson) => {
        console.log(createdPerson);
        const id = createdPerson._id;
        const updatedObject = {
          name: 'roxius',
          age: 99,
          favoriteColor: 'black'
        };
        return request(app)
          .put(`/people/${id}`)
          .send(updatedObject)
          .then(() => {
            return request(app)
              .get(`/people/${id}`)
              .then(res => {
                console.log(res.body);
                expect(res.body.name).toContain('roxius');
              });
          });
      });
  });
  
  it('deletes a person with :id and returns the delete count', () => {
    return createPerson('kristin1')
      .then((createdPerson) => {
        const id = createdPerson._id;
        return request(app)
          .delete(`/people/${id}`)
          .then(res => {
            expect(res.body).toEqual({ 'deleted': 1 });
          });
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
        console.log(body);
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
        console.log(createdTweet);
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
                console.log(res.body);
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
