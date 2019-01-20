const request = require('supertest');
const app = require('../lib/app');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');

const createPerson = name => {
  return request(app)
      .post('/people')
      .send({
        name: name,
        age: 100,
        favoriteColor: 'red',
        favCharId: 1
      })
    .then(res => res.body);
}

describe('app tests', () => {
  beforeEach(done => {
    rimraf('./data/people', done);
  });

  beforeEach(done => {
    mkdirp('./data/people', done);
  });

  it('creates a person', () => {
    return request(app)
      .post('/people')
      .send({
        name: 'Uncle bob',
        age: 100,
        favoriteColor: 'red',
        favCharId: 1
      })
      .then(res => {
        expect(res.body).toEqual({
          name: 'Uncle bob',
          age: 100,
          favoriteColor: 'red',
          _id: expect.any(String),
          favChar: 
            {
              'birth_year': '19BBY',
              'hair_color': "blond",
              'height': "172",
              'mass': "77",
              'name': "Luke Skywalker"
            }
        }) 
      })
  })

  it('gets list of people created in db', () => {
    const namesToCreate =['tt1','tt2', 'tt3', 'tt4'];
    return Promise.all(namesToCreate.map(createPerson))
      .then(() => {
        return request(app)
          .get('/people')
      })
      .then(({ body }) => {
        expect(body).toHaveLength(4);
      });
  })

  it('gets a person by id', () => {
    return createPerson('teonna')
      .then(createdPerson => {
        const id = createdPerson._id;
        return request(app)
          .get(`/people/${id}`)
      })
      .then(res => {
        expect(res.body.name).toEqual('teonna');
      })
  })
  it('updates by id', () => {
    return createPerson('tt')  
      .then(createdPerson => {
        const id = createdPerson._id;
        return request(app)
          .put(`/people/${id}`)
          .send({
            name: 'tt1',
            age: 31,
            favoriteColor: 'purple',
            id: id,
            favCharId: 1

          })
          .then(() => {
            return request(app)
              .get(`/people/${id}`)
              .then(res => {
                expect(res.body).toEqual({
                  name: 'tt1',
                  age: 31,
                  favoriteColor: 'purple',
                  _id: id,
                  favCharId: 1
                })
            })
          })
      })
  })

  it('deletes by id', () => {
    return createPerson ('deletedTeonna')
      .then(createdPerson => {
        const id = createdPerson._id;
        return request(app)
          .delete(`/people/${id}`)
      .then(res => {
        expect(res.body).toEqual({ deleted: 1})
      })
      })
  })
})


