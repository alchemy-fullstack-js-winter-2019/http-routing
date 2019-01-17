const app = require('../lib/app');
const request = require('supertest');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');

const createGuitars = (model) => {
  return request(app)
    .post('/guitars')
    .send({
      model: model,
      make: 'Gibson',
      _id: expect.any(String)
    })
    .then(res => res.body);
};

describe('guitars', () => {
  beforeEach(done => {
    rimraf('./data/guitars', err => {
      done(err);
    });
  });

  beforeEach(done => {
    mkdirp('./data/guitars', err => {
      done(err);
    });
  });

  it('creates a guitar', () => {
    return request(app)
      .post('/guitars')
      .send({
        model: 'Star',
        make: 'Les Paul'
      })
      .then(res => {
        expect(res.body).toEqual({
          model: 'Star',
          make: 'Les Paul',
          _id: expect.any(String)
        });
      });
  });

  it('gets a list of all guitars', () => {
    return Promise.all(['Aaron1', 'Aaron2', 'Aaron3', 'Aaron4', 'Aaron5'].map(model => {
      return createGuitars(model);
    }))
      .then(() => {
        return request(app)
          .get('/guitars');
      })
      .then(({ body }) => {
        expect(body).toHaveLength(5);
      });
  });

  it('gets a single guitar by id', () => {
    return createGuitars('Burst')
      .then(createdGuitars => {
        const id = createdGuitars._id;
        return request(app)
          .get(`/guitars/${id}`);
      })
      .then(res => {
        expect(res.body.model).toContain('Burst');
      });
  });

  it('finds and updates a single guitar by id', () => {
    return createGuitars('Burst')
      .then(createdGuitars => {
        const id = createdGuitars._id;
        createdGuitars.model = 'Starburst';
        return request(app)
          .put(`/guitars/${id}`)
          .send(createdGuitars);
      })
      .then(res => {
        expect(res.body.model).toEqual('Starburst');
      });
  });

  it('finds and deletes a tweet by id', () => {
    return createGuitars('Bursting')
      .then(createdGuitars => {
        const id = createdGuitars._id;
        return request(app)
          .delete(`/guitars/${id}`);
      })
      .then(res => {
        expect(res.body).toEqual({ 'deleted': 1 });
      });
  });
});
