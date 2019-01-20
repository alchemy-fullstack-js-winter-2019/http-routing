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

  it('returns a task by id', () => {
    const newTask = makeTask('new Task');
    const id = newTask._id;

    return request(app)
      .get(`/tasks/${id}`)
      .then(res => {
        expect(res.body[0]).toEqual({ 
          title: 'new Task',
          description: 'This is a task',
          _id: expect.any(String) });
      });
  });

  it('updates a task by id', () => {
    return makeTask('new Task')
      .then(newTask => {
        const id = newTask._id;
        return request(app)
          .put(`/tasks/${id}`)
          .send({
            title: 'updated Task',
            description: 'This is a task',
            _id: id
          })
          .then(() => {
            return request(app)
              .get(`/tasks/${id}`)
              .then(res => {
                expect(res.body[0]).toEqual({
                  title: 'updated Task',
                  description: 'This is a task',
                  _id: id
                });
              });
          });
      });
  });

  it('deletes a task with id', () => {
    return makeTask('task to delete')
      .then(returnedTask => {
        const id = returnedTask._id;
        return request(app)
          .delete(`/tasks/${id}`)
          .then(res => {
            expect(res.body).toEqual({ deleted: 1 });
          });
      });
  });
});

