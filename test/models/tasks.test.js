/* eslint-disable no-console */
const app = require('../../lib/app');
const mkdirp = require('mkdirp');
const request = require('supertest');
const rimraf = require('rimraf');

const makeTask = (title) => {
  return request(app)
    .post('/tasks')
    .send({
      title: title,
      description: "This is a task"
    })
    .then(res => res.body);
};

describe('Tasks', () => {

  beforeEach(done => {
    rimraf('./data/tasks', err => {
      done(err);
    });
  });

  beforeEach(done => {
    mkdirp('./data/tasks', err => {
      done(err);
    });
  });

  it('adds a new tasks', () => {
    return request(app)
      .post('/tasks')
      .send({
        title: 'task1',
        description: 'add this task'
      })
      .then(res => {
        expect(res.body).toEqual({
          title: 'task1',
          description: 'add this task',
          _id: expect.any(String)
        });
      });
  });

  it('returns a list of all tasks', () => {
    const taskList = ['task 2', 'task 3', 'task 4'];
    return Promise.all(taskList.map(task => makeTask(task)
    ))
      .then(() => {
        return request(app)
          .get('/tasks');
      })
      .then(req => {
        expect(req.body).toHaveLength(3);
      });
  });

});

