const request = require('supertest');
const app = require('../lib/app');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');

const createAnimal = (name) => {
  return request(app)
    .post('/animals')
    .send({ 
      name: name,
      type: 'mammal'
    })
    .then(res => res.body);
};

describe('animal tests', () => {

  beforeEach((done) => {
    rimraf('./data/animals', err => {
      done(err);
    });
  });

  beforeEach((done) => {
    mkdirp('./data/animals', err => {
      done(err);
    });
  });

  it('creates an animal', () => {
    return request(app)
      .post('/animals')
      .send({ 
        name: 'tiger',
        type: 'mammal'
      })
      .then(res => {
        expect(res.body).toEqual({
          name: 'tiger',
          type: 'mammal',
          _id: expect.any(String)
        });
      });
  });

  it('can list all the animals in the database', () => {
    const names = ['dolphin', 'panda', 'tiger', 'wolf'];
    return Promise.all(names.map(createAnimal))
      .then(() => {
        return request(app)
          .get('/animals');
      })
      .then(({ body }) => {
        expect(body).toHaveLength(4);
      });
  });

  it('gets an animal by id', () => {
    return createAnimal('tiger')
      .then((createdAnimal) => {
        const id = createdAnimal._id;
        return request(app)
          .get(`/animals/${id}`);
      })
      .then(res => {
        expect(res.body.name).toContain('tiger');
      });
  });

  it('updates an animal with :id and returns the update', () => {
    return createAnimal('tiger')
      .then((createdAnimal) => {
        const id = createdAnimal._id;
        const updatedObject = {
          name: 'snake',
          type: 'reptile'
        };
        return request(app)
          .put(`/animals/${id}`)
          .send(updatedObject)
          .then(() => {
            return request(app)
              .get(`/animals/${id}`)
              .then(res => {
                expect(res.body.name).toContain('snake');
              });
          });
      });
  });

  it('deletes an animal with :id and returns the delete count', () => {
    return createAnimal('koala')
      .then((createdAnimal) => {
        const id = createdAnimal._id;
        return request(app)
          .delete(`/animals/${id}`)
          .then(res => {
            expect(res.body).toEqual({ 'deleted': 1 });
          });
      });
  });
});
