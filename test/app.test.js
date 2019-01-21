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
        done();
      });
  });

  it('gets list of people', () => {
    return request(app)
      .get('/people')
      .then(res => expect(JSON.parse(res.text)).toEqual({
        1: person
      }));
  });

  it('gets person by id', () => {
    return request(app)
      .get(`/people/${person.id}`)
      .then(res => expect(JSON.parse(res.text)).toEqual(person));
  });

  it('updates a person by id', () => {
    return request(app)
      .put(`/people/${person.id}`)
      .send({
        id: 1,
        name: 'shabster',
        age: 36,
        color: 'red'
      })
      .then(res => expect(JSON.parse(res.text)).toEqual({
        id: 1,
        name: 'shabster',
        age: 36,
        color: 'red'
      }));
  });
});
