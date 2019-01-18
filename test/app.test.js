const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const request = require('supertest');
const app = require('../lib/app');

const createPerson = name => {
  return request(app)
    .post('/people')
    .send({
      name,
      age: 100,
      favoriteColor: 'red'
    })
    .then(res => res.body);
};

describe('app tests', () => {
  beforeEach(done => {
    rimraf('./data/people', err => {
      done(err);
    });
  });

  beforeEach(done => {
    mkdirp('./data/people', err => {
      done(err);
    });
  });

  it('creates a person', () => {
    return request(app)
      .post('/people')
      .send({
        name: 'Uncle bob',
        age: 100,
        favoriteColor: 'red'
      })
      .then(res => {
        expect(res.body).toEqual({
          name: 'Uncle bob',
          age: 100,
          favoriteColor: 'red',
          _id: expect.any(String)
        });
      });
  });

  it('gets a list of people from from our db', () => {
    const namesToCreate = ['ryan', 'ryan1', 'ryan2', 'ryan3'];
    return Promise.all(namesToCreate.map(createPerson))
      .then(() => {
        return request(app)
          .get('/people');
      })
      .then(({ body }) => {
        expect(body).toHaveLength(4);    
      });
  });

  it('gets a person by id', () => {
    return createPerson('Carmen')
      .then(personWhoWasCreated => {
        const id = personWhoWasCreated._id;
        return request(app)
          .get(`/people/${id}`)
          .then(res => {
            expect(res.body).toEqual({
              name: 'Carmen',
              age: 100,
              favoriteColor: 'red',
              _id: id
            });
          });
      });
  });
  it('updates a person by id', () => {
    return createPerson('Carmen')
      .then(personWhoWasCreated => {
        const id = personWhoWasCreated._id;
        return request(app)
          .put(`/people/${id}`) // put(`/people/${personWhoWasCreate._id})
          .send ({             // send( {age: 23 })  => is the whole object
            name: 'Carmen',
            age: 23,
            favoriteColor: 'red'
          })
          .then(res => {
            expect(res.body).toEqual(({   // expect(res.body.age).toEqual(23)
              _id: expect.any(String),   
              name: 'Carmen',
              age: 23,
              favoriteColor: 'red',
            }));
          });
      });
  });
  it('deletes a person with :id and returns the delete count', () => {
    return createPerson('Carmen')
      .then(personWhoWasCreated => {
        return request(app)
          .delete(`/people/${personWhoWasCreated._id}`)
          .then(res => {
            expect(res.body).toEqual({ deleted: 1 }); 
          });

      });
  });  
});    
