const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const request = require('supertest');
const app = require('../lib/app');

const createPerson = name => {
  return request(app)
    .post('/people')
    .send({
      name,
      age: 10,
      favoriteColor: 'gold',
      favoriteCharacterId: 7
    })
    .then(res => res.body);
};
const createPuppy = (name, age = 1) => {
  return request(app)
    .post('/puppies')
    .send({
      name,
      age: age,
      favoriteFood: 'bacon'
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

// APP ------------------------------------------
describe('app tests', () => {
  beforeAll(done => {
    mkdirp('./data/people', done);
    mkdirp('./data/puppies', done);
    mkdirp('./data/cats', done);
    done();
  });
  afterEach(done => {
    rimraf('./data/people/*', done);
    rimraf('./data/puppies/*', done);
    rimraf('./data/cats/*', done);
    done();
  });
  afterAll(done => {
    createPuppy('Spot');
    createCat('Tabby');
    return request(app)
      .post('/people')
      .send({
        name: 'Awesome person',
        age: 24,
        favoriteColor: 'phthalo blue',
        favoriteCharacterId: 30
      })
      .then(res => {
        res.body;
        done();
      });
  });

  // CREATE ------------------------------------------
  it('creates a person', () => {
    return request(app)
      .post('/people')
      .send({
        name: 'Steve Jobs',
        age: 70,
        favoriteColor: 'apple red',
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
          favoriteColor: 'apple red',
          name: 'Steve Jobs'
        });
      });
  });
  it('creates a puppy', () => {
    return request(app)
      .post('/puppies')
      .send({
        name: 'snacktime',
        age: 1,
        favoriteFood: 'poo'
      })
      .then(res => {
        expect(res.body).toEqual({
          name: 'snacktime',
          age: 1,
          favoriteFood: 'poo',
          _id: expect.any(String)
        });
      });
  });
  it('creates a cat', () => {
    return request(app)
      .post('/cats')
      .send({
        name: 'niki',
        age: 3,
        favoriteFood: 'snacks'
      })
      .then(res => {
        expect(res.body).toEqual({
          name: 'niki',
          age: 3,
          favoriteFood: 'snacks',
          _id: expect.any(String)
        });
      });
  });

  // GET LIST ------------------------------------------
  it('gets a list of people from our db', () => {
    const namesToCreate = ['cari', 'cari1', 'cari2', 'cari3'];
    return Promise.all(namesToCreate.map(createPerson))
      .then(() => {
        return request(app)
          .get('/people');
      })
      .then(({ body }) => {
        expect(body).toHaveLength(4);
      });
  });
  it('gets a list of puppies from our db', () => {
    const namesToCreate = ['lego', 'ego', 'prego', 'ragu'];
    return Promise.all(namesToCreate.map(createPuppy))
      .then(() => {
        return request(app)
          .get('/puppies');
      })
      .then(({ body }) => {
        expect(body).toHaveLength(4);
      });
  });
  it('gets a list of cats from our db', () => {
    const namesToCreate = ['silki', 'kiki', 'bobby', 'max'];
    return Promise.all(namesToCreate.map(createCat))
      .then(() => {
        return request(app)
          .get('/cats');
      })
      .then(({ body }) => {
        expect(body).toHaveLength(4);
      });
  });

  // GET BY ID ------------------------------------------
  it('gets a person by id', () => {
    return createPerson('cari')
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
              favoriteColor: 'gold',
              name: 'cari'
            });
          });
      });
  });
  it('gets a puppy by id', () => {
    return createPuppy('tortilla')
      .then(puppyWhoWasCreated => {
        const _id = puppyWhoWasCreated._id;
        return request(app)
          .get(`/puppies/${_id}`)
          .then(res => {
            expect(res.body).toEqual({
              name: 'tortilla',
              age: 1,
              favoriteFood: 'bacon',
              _id
            });
          });
      });
  });
  it('gets a cat by id', () => {
    return createCat('zorro')
      .then(catWhoWasCreated => {
        const _id = catWhoWasCreated._id;
        return request(app)
          .get(`/cats/${_id}`)
          .then(res => {
            expect(res.body).toEqual({
              name: 'zorro',
              age: 2,
              favoriteFood: 'catnip',
              _id
            });
          });
      });
  });

  // PUT ------------------------------------------
  it('updates a person with :id and returns the update', () => {
    let newPerson = {
      name: 'steve',
      age: 40,
      favoriteColor: 'blue',
      favoriteCharacterId: 80
    };
    return createPerson('cari')
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
            name: 'Tarfful'
          },
          favoriteColor: 'blue',
          name: 'steve'
        });
      });
  });
  it('updates a puppy with :id and returns the update', () => {
    let newPuppy = {
      name: 'umbro',
      age: 2,
      favoriteFood: 'kibble'
    };
    return createPuppy('umbro')
      .then(createdPuppy => {
        const _id = createdPuppy._id;
        return request(app)
          .put(`/puppies/${_id}`)
          .send(newPuppy);
      })
      .then(res => {
        expect(res.body.name).toEqual('umbro');
      });
  });
  it('updates a cat with :id and returns the update', () => {
    let newCat = {
      name: 'smelly',
      age: 1,
      favoriteFood: 'humus'
    };
    return createCat('smelly')
      .then(createdCat => {
        const _id = createdCat._id;
        return request(app)
          .put(`/cats/${_id}`)
          .send(newCat);
      })
      .then(res => {
        expect(res.body.name).toEqual('smelly');
      });
  });

  // DELETE ------------------------------------------
  it('can delete a person with :id and returns the delete count', () => {
    return createPerson('carl')
      .then(personWhoWasCreated => {
        const _id = personWhoWasCreated._id;
        return request(app)
          .delete(`/people/${_id}`)
          .then(res => {
            expect(res.body).toEqual({ deleted: 1 });
          });
      });
  });
  it('can delete a puppy with :id and returns the delete count', () => {
    return createPuppy('bumper')
      .then(puppyWhoWasCreated => {
        const _id = puppyWhoWasCreated._id;
        return request(app)
          .delete(`/puppies/${_id}`)
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

  // NOT FOUND
  it('displays error when path not found', () => {
    return request(app)
      .get('/boooooooooo')
      .then(res => {
        expect(res.status).toEqual(404);
      });
  });

});
