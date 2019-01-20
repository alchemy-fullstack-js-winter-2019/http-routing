const request = require('supertest');
const app = require('../lib/app');

let person = null;
describe('app', () => {
  beforeEach(done => {
    request(app)
      .post('/people')
      .send({
        id: 1,
        name: 'shabz',
        age: 26,
        color: 'red'
      })
      .then(res => {
        person = JSON.parse(res.text);
        console.log('person', person);
        done();
      });
  });

  it('gets list of people', () => {
    return request(app)
      .get('/people')
      .then(res => expect(JSON.parse(res.text)).toEqual({
        1: {
          id: 1,
          name: 'shabz',
          age: 26,
          color: 'red'
        }
      }));
  });
});
