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
        favoriteColor: 'red'
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
        favoriteColor: 'red'
      })
      .then(res => {
        expect(res.body).toEqual({
          name: 'Uncle bob',
          age: 100,
          favoriteColor: 'red',
          _id: expect.any(String)
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
        const id = createdPerson._id
        console.log(id);
        return request(app)
          .get(`/people/${id}`)
      })
      .then(({ body }) => {
        expect(body.name).toEqual('teonna');
      })
  })
  // it('get a person by id and updates', () => {
  //   return createPerson('tbird')
  //     .then(createdPerson => {
  //       const id =  createdPerson._id
  //       return request(app)
  //         .get(`/people/${id}`)
  //     })
  //     .then(updatedPerson => {
      
  //       .put()
  //     })
  // })
});
