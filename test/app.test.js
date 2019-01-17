const app = require('../lib/app');
const request = require('supertest');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');

const createPerson = (name) => {
  return request(app)
    .post('/people')
    .send({
      name: name,
      age: '100',
      favoriteColor: 'red'
    });
};

// const createTweet = (handle) => {
//   return request(app)
//     .post('/tweets')
//     .send({
//       handle,
//       tweet: 'tweet tweet'
//     });
// };

describe('people', () => {
  beforeEach(done => {
    rimraf('./data/people', err => {
      done(err);
    });
    // rimraf('./data/tweets', err => {
    //   done(err);
    // });
  });

  beforeEach(done => {
    mkdirp('./data/people', err => {
      done(err);
    });
    // mkdirp('./data/tweets', err => {
    //   done(err);
    // });
  });

  it('creates a person', () => {
    return request(app)
      .post('/people')
      .send({
        name: 'Uncle Bob',
        age: '100',
        favoriteColor: 'red'
      })
      .then(res => {
        expect(res.body).toEqual({
          name: 'Uncle Bob',
          age: '100',
          favoriteColor: 'red',
          _id: expect.any(String)
        });
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

  it('can get a list of people from our db', () => {
    const namesToCreate = ['paige', 'bob', 'jim', 'frank', 'billy'];
    return Promise.all(namesToCreate.map(createPerson))
      .then(() => {
        return request(app)
          .get('/people');
      })
      .then(({ body }) => {
        expect(body).toHaveLength(5);
      });
  });

  it('can get a person by id', () =>{
    return createPerson('boohbah')
      .then(({ body }) => {
        return request(app)
          .get(`/people/${body._id}`);
      })
      .then(({ body }) => {
        expect(body).toEqual({
          name: 'boohbah',
          age: '100',
          favoriteColor: 'red',
          _id: expect.any(String)
        });
      });
  });

  it('can find by id and update', () => {
    return createPerson('boohbah')
      .then(({ body }) => {
        return request(app)
          .put(`/people/${body._id}`);
      })
      .then(({ body }) => {
        return Promise.all([
          Promise.resolve(body._id),
          request(app)
            .get(`/people/${body._id}`, () => {
            })
        ]);
      })
      .then(([_id, { body }]) => {
        expect(body).toEqual({
          name: 'banana',
          age: '20',
          favoriteColor: 'blue',
          _id
        });
      });
  });

  it('can delete a person', () => {
    return createPerson('jello')
      .then(({ body }) => {
        return request(app)
          .delete(`/people/${body._id}`);
      })
      .then(({ body }) => {
        expect(body).toEqual({ deleted: 1 });
      });
  });
});
