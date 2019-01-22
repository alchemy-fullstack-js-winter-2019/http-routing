const request = require('supertest');
const app = require('../lib/app');

let person = null;
describe('people', () => {
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

  it('get person by id returns Not Found', () => {
    return request(app)
      .get('/people/3')
      .then(res => expect(JSON.parse(res.text)).toEqual('Not Found'));
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
  
  it('update returns Not Found', () => {
    return request(app)
      .put('/people/3')
      .send({
        id: 3,
        name: 'shabster',
        age: 36,
        color: 'red'
      })
      .then(res => expect(JSON.parse(res.text)).toEqual('Not Found'));
  });

  it('deletes a person by id', () => {
    return request(app)
      .delete(`/people/${person.id}`)
      .then(res => expect(JSON.parse(res.text)).toEqual({ deleted: 1 }));
  });

  it('deletes a person by id returns Not Found', () => {
    return request(app)
      .delete('/people/3')
      .then(res => expect(JSON.parse(res.text)).toEqual('Not Found'));
  });

  it('returns Not Found for unsupported route', () => {
    return request(app)
      .get('/people/person')
      .then(res => expect(JSON.parse(res.text)).toEqual('Not Found'));
  });
});
