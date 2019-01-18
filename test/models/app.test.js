const app = require('../../lib/app');
const request = require('supertest');
// const People = require('../lib/models/People');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf'); 


const createPerson = (name) => {
  return request(app)
    .post('/people')
    .send({
      name: name,
      age: 40,
      favoriteColor: 'Periwinkle',
      favoriteCharacterId: 1
    })
    .then(res => res.body);
};
describe('gets people', () => {
  beforeEach(done => {
    rimraf('./data/people', err => {
      done(err);
    });
  });
  beforeEach((done) => {
    mkdirp('./data/people', err => {
      done(err);
    });
  });
  it('makes a person', () => {
    return request(app)
      .post('/people')
      .send({
        name: 'Jeffery',
        age: '40',
        favoriteColor: 'Periwinkle',
        favoriteCharacterId: 1
      })
      .then(res => {
        expect(res.text).toContain('Luke');
      });
  });
  it('gets a people', () => {
    const namesToCreate = ['marcy1', 'marcy2', 'marcy3', 'marcy4'];
    return  Promise.all(namesToCreate.map(createPerson))
      .then(() => {
        return request(app)
          .get('/people');
      })
      .then(({ body }) => {
        expect(body).toHaveLength(4);
      });
  });
  it('is able to add a favorite person', () => {

  });
  it('gets a person by id', () => {
    return createPerson('marcy1')
      .then(personWhoWasCreated => {
        const id = personWhoWasCreated._id;
        return request(app)
          .get(`/people/${id}`);
      })
      .then(res => {
        expect(res.body).toEqual({
          name: 'marcy1',
          age: 40,
          favoriteColor: 'Periwinkle',
          _id: expect.any(String)
        });
      });
  });
  it('finds by Id and updates', () => {
    return createPerson('marcy1')
      .then(personWhoWasCreated => {
        const id = personWhoWasCreated._id;
        const updatedObject = ({ name: 'marcy2',
          age: 40,
          favoriteColor: 'Periwinkle',
          _id: expect.any(String) });
        return request(app) 
          .put(`/people/${id}`)
          .send(updatedObject)
          /* eslint-disable-next-line*/
          .then(res => {
            return request(app)
              .get(`/people/${id}`)
              .then(res => {
                expect(res.body).toEqual({
                  name: 'marcy2',
                  age: 40,
                  favoriteColor: 'Periwinkle',
                  _id: id
                });
              });
          });
      });
  }); 
  it('deletes a person', () => {
    return createPerson('marcy1')
      .then(personWhoWasCreated => {
        const id = personWhoWasCreated._id;
        return request(app)
          .delete(`/people/${id}`)
          .then(res => {
            expect(res.status).toEqual(200);
          });
      });
  });
});

