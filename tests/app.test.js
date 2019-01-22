const request = require('supertest');
const app = require('../lib/app');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');

const createPerson = (name) => {
  return request(app)
    .post('/people')
    .send({
      name,
      age: 80,
      favoriteColor: 'blue',
      favoriteCharacterId: 7
    })
    .then(res => res.body);
};

const createCat = (name, age = 2) => {
  return request(app)
    .post('/cats')
    .send({
      name,
      age: age,
      favoriteFood: 'catnip'
    })
    .then(res => res.body);
};

const createTweet = (name, age = 1) => {
  return request(app)
    .post('/tweets')
    .send({
      name,
      age: age
    })
    .then(res => res.body);
};

// APP tests

describe('app tests', () => {
  beforeAll(done => {
    mkdirp('./data/people', done);
    mkdirp('./data/tweets', done);
    mkdirp('./data/cats', done);
    done();
  });
  afterEach(done => {
    rimraf('./data/people/*', done);
    rimraf('./data/tweets/*', done);
    rimraf('./data/cats/*', done);
    done();
  });
  afterAll(done => {
    createTweet('Hi there');
    createCat('Tabby');
    return request(app)
      .post('/people')
      .send({
        name: 'Uncle Bob',
        age: 24,
        favoriteColor: 'deep purple',
        favoriteCharacterId: 30
      })
      .then(res => {
        res.body;
        done();
      });
  });

  // CREATE tests

  it('creates a person', () => {
    return request(app)
      .post('/people')
      .send({
        name: 'Billy Bob',
        age: 70,
        favoriteColor: 'red',
        favoriteCharacterId: 8
      })
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.body).toEqual({
          _id: expect.any(String), 
          age: 70,
          favoriteCharacter: {
            birthYear: 'unknown',
            hairColor: 'n/a',
            height: '97',
            mass: '32',
            name: 'R5-D4'
          },
          favoriteColor: 'red',
          name: 'Billy Bob'
        });
      });
  });
  it('creates a tweet', () => {
    return request(app)
      .post('/tweets')
      .send({
        name: 'hi there',
        age: 1,
      })
      .then(res => {
        expect(res.body).toEqual({
          name: 'hi there',
          age: 1,
          _id: expect.any(String)
        });
      });
  });
  it('creates a cat', () => {
    return request(app)
      .post('/cats')
      .send({
        name: 'whiskers',
        age: 3,
        favoriteFood: 'catnap'
      })
      .then(res => {
        expect(res.body).toEqual({
          name: 'whiskers',
          age: 3,
          favoriteFood: 'catnap',
          _id: expect.any(String)
        });
      });
  });

  // GET a list tests

  it('gets a list of people from our db', () => {
    const namesToCreate = ['abel', 'abel1', 'abel2', 'abel3'];
    return Promise.all(namesToCreate.map(createPerson))
      .then(() => {
        return request(app)
          .get('/people');
      })
      .then(({ body }) => {
        expect(body).toHaveLength(4);
      });
  });
  it('gets a list of tweets from our db', () => {
    const namesToCreate = ['tweet1', 'tweet2', 'tweet3', 'tweet4'];
    return Promise.all(namesToCreate.map(createTweet))
      .then(() => {
        return request(app)
          .get('/tweets');
      })
      .then(({ body }) => {
        expect(body).toHaveLength(4);
      });
  });
  it('gets a list of cats from our db', () => {
    const namesToCreate = ['whiskers', 'pepper', 'chili', 'geddy'];
    return Promise.all(namesToCreate.map(createCat))
      .then(() => {
        return request(app)
          .get('/cats');
      })
      .then(({ body }) => {
        expect(body).toHaveLength(4);
      });
  });

  // GET by ID tests

  it('gets a person by id', () => {
    return createPerson('abel')
      .then(personWhoWasCreated => {
        const _id = personWhoWasCreated._id;
        return request(app)
          .get(`/people/${_id}`)
          .then(res => {
            expect(res.body).toEqual({
              _id: expect.any(String), 
              age: 10,
              favoriteCharacter: {
                birthYear: '47BBY',
                hairColor: 'brown',
                height: '165',
                mass: '75',
                name: 'Beru Whitesun lars'
              },
              favoriteColor: 'blue',
              name: 'abel'
            });
          });
      });
  });
  it('gets a tweet by id', () => {
    return createTweet('taco cat')
      .then(createdTweet => {
        const _id = createdTweet._id;
        return request(app)
          .get(`/tweets/${_id}`)
          .then(res => {
            expect(res.body).toEqual({
              name: 'taco cat',
              age: 1,
              _id
            });
          });
      });
  });
  it('gets a cat by id', () => {
    return createCat('bootsy')
      .then(catWhoWasCreated => {
        const _id = catWhoWasCreated._id;
        return request(app)
          .get(`/cats/${_id}`)
          .then(res => {
            expect(res.body).toEqual({
              name: 'bootsy',
              age: 2,
              favoriteFood: 'catnip',
              _id
            });
          });
      });
  });

  // PUT tests

  it('updates a person with :id and returns the update', () => {
    let newPerson = {
      name: 'bob',
      age: 40,
      favoriteColor: 'green',
      favoriteCharacterId: 80
    };
    return createPerson('abel')
      .then(createdPerson => {
        const _id = createdPerson._id;
        return request(app)
          .put(`/people/${_id}`)
          .send(newPerson);
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String), 
          age: 40,
          favoriteCharacter: {
            birthYear: 'unknown',
            hairColor: 'brown',
            height: '234',
            mass: '136',
            name: 'Chewie'
          },
          favoriteColor: 'green',
          name: 'bob'
        });
      });
  });
  it('updates a tweet with :id and returns the update', () => {
    let newTweet = {
      name: 'sup',
      age: 2,
    };
    return createTweet('sup')
      .then(createdTweet => {
        const _id = createdTweet._id;
        return request(app)
          .put(`/tweets/${_id}`)
          .send(newTweet);
      })
      .then(res => {
        expect(res.body.name).toEqual('sup');
      });
  });
  it('updates a cat with :id and returns the update', () => {
    let newCat = {
      name: 'kitty',
      age: 1,
      favoriteFood: 'catnip'
    };
    return createCat('kitty')
      .then(createdCat => {
        const _id = createdCat._id;
        return request(app)
          .put(`/cats/${_id}`)
          .send(newCat);
      })
      .then(res => {
        expect(res.body.name).toEqual('kitty');
      });
  });

  // DELETE tests

  it('can delete a person with :id and returns the delete count', () => {
    return createPerson('juan')
      .then(personWhoWasCreated => {
        const _id = personWhoWasCreated._id;
        return request(app)
          .delete(`/people/${_id}`)
          .then(res => {
            expect(res.body).toEqual({ deleted: 1 });
          });
      });
  });
  it('can delete a tweet with :id and returns the delete count', () => {
    return createTweet('lol')
      .then(createdTweet => {
        const _id = createdTweet._id;
        return request(app)
          .delete(`/tweets/${_id}`)
          .then(res => {
            expect(res.body).toEqual({ deleted: 1 });
          });
      });
  });
  it('can delete a cat with :id and returns the delete count', () => {
    return createCat('hei')
      .then(catWhoWasCreated => {
        const _id = catWhoWasCreated._id;
        return request(app)
          .delete(`/cats/${_id}`)
          .then(res => {
            expect(res.body).toEqual({ deleted: 1 });
          });
      });
  });

  // NOT FOUND tests

  it('displays error when path not found', () => {
    return request(app)
      .get('/error')
      .then(res => {
        expect(res.status).toEqual(404);
      });
  });

});
