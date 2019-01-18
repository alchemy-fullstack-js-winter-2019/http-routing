const request = require('supertest');
const app = require('../lib/app');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');

const createTask = (title) => {
  return request(app)
    .post('/tasks')
    .send({ 
      title: title,
      description: 'so much fun'
    })
    .then(res => res.body);
};

describe('task tests', () => {

  beforeEach((done) => {
    rimraf('./data/tasks', err => {
      done(err);
    });
  });

  beforeEach((done) => {
    mkdirp('./data/tasks', err => {
      done(err);
    });
  });

  it('creates a task', () => {
    return request(app)
      .post('/tasks')
      .send({ 
        title: 'wash car',
        description: 'so much fun'
      })
      .then(res => {
        expect(res.body).toEqual({
          title: 'wash car',
          description: 'so much fun',
          _id: expect.any(String)
        });
      });
  });

  it('can list all the tasks in the database', () => {
    const titles = ['go grocery shopping', 'do laundry', 'brush roxius', 'watch the bachelor'];
    return Promise.all(titles.map(createTask))
      .then(() => {
        return request(app)
          .get('/tasks');
      })
      .then(({ body }) => {
        expect(body).toHaveLength(4);
      });
  });

  it('gets a task by id', () => {
    return createTask('wash car')
      .then((createdTask) => {
        const id = createdTask._id;
        return request(app)
          .get(`/tasks/${id}`);
      })
      .then(res => {
        expect(res.body.title).toContain('wash car');
      });
  });

  it('updates a task with :id and returns the update', () => {
    return createTask('wash car')
      .then((createdTask) => {
        const id = createdTask._id;
        const updatedObject = {
          title: 'do dishes',
          description: 'so much fun'
        };
        return request(app)
          .put(`/tasks/${id}`)
          .send(updatedObject)
          .then(() => {
            return request(app)
              .get(`/tasks/${id}`)
              .then(res => {
                expect(res.body.title).toContain('do dishes');
              });
          });
      });
  });

  it('deletes a task with :id and returns the delete count', () => {
    return createTask('go run')
      .then((createdTask) => {
        const id = createdTask._id;
        return request(app)
          .delete(`/tasks/${id}`)
          .then(res => {
            expect(res.body).toEqual({ 'deleted': 1 });
          });
      });
  });
});
