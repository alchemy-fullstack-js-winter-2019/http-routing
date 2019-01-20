const request = require('supertest');
const app = require('../lib/app');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');

const createTask = (task) => {
  return request(app)
    .post('/tasks')
    .send({
      task: task,
      completed: 'no'
    })
    .then(res => res.body);
};

describe('tasks', () => {
  beforeEach(done => {
    rimraf('./data/tasks', done);
  });

  beforeEach(done => {
    mkdirp('./data/tasks', done);
  });

  it('creates a task', () => {
    return request(app)
      .post('/tasks')
      .send({
        task: 'wash car',
        completed: 'no'
      })
      .then(res => {
        expect(res.body).toEqual({
          task: 'wash car',
          completed: 'no',
          _id: expect.any(String)
        });
      });
  });
  it('gets a list of all the tasks', () => {
    const tasks = ['wash car', 'buy groceries', 'walk the cats'];
    return Promise.all(tasks.map(createTask))
      .then(() => {
        return request(app)
          .get('/tasks');
      })
      .then(({ body }) => {
        expect(body).toHaveLength(3);
      });
  });
  it('gets a task by id', () => {
    return createTask('go to the gym')
      .then(createdTask => {
        const id = createdTask._id;
        return request(app) 
          .get(`/tasks/${id}`);
      })
      .then(({ body }) => {
        expect(body).toEqual({
          task: 'go to the gym',
          completed: 'no',
          _id: expect.any(String)
        });
      });
  });
  it('updates by id', () => {
    return createTask('spend lots of money')
      .then(createdTask => {
        const id = createdTask._id;
        return request(app)
          .put(`/tasks/${id}`)
          .send({
            task: 'spend lots of dough',
            completed: 'no',
            _id: id
          })
          .then(() => {
            return request(app)
              .get(`/tasks/${id}`)
              .then(res => {
                expect(res.body).toEqual({
                  task: 'spend lots of dough',
                  completed: 'no',
                  _id: id
                });
              });
          });
      });
  });
  it('deletes by id', () => {
    return createTask('deletedTask')
      .then(createdTask => {
        const id = createdTask._id;
        return request(app)
          .delete(`/tasks/${id}`);
      })
      .then(res => {
        expect(res.body).toEqual({ deleted: 1 });
      });
  });
  
});
