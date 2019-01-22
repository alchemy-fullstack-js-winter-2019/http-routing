const request = require('supertest');
const app = require('../lib/app');

let task = null;
describe('tasks', () => {
  beforeEach(done => {
    request(app)
      .post('/tasks')
      .send({
        id: 1,
        title: 'Something',
        description: 'do something with something'
      })
      .then(res => {
        task = JSON.parse(res.text);
        done();
      });
  });

  it('gets list of tasks', () => {
    return request(app)
      .get('/tasks')
      .then(res => expect(JSON.parse(res.text)).toEqual({
        1: task
      }));
  });
});
