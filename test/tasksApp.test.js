const request = require('supertest');
const app = require('../lib/app');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');

const createTask = (task, completed) => {
  return request(app)
    .post('/tasks')
    .send({
      task: task,
      completed: completed
    })
  .then(res => res.body);
};

describe('tasks', () => {
  beforeEach(done => {
    rimraf('./data/tasks', done);
  })

  beforeEach(done => {
    mkdirp('./data/tasks', done);
  })

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
        })
      })
  })
})