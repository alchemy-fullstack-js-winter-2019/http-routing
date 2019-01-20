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
    rimraf('./data/tasks');
    done();
  });

  beforeEach(done => {
    mkdirp('./data/tasks');
    done();
  });

  

});
