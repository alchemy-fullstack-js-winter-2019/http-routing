const request = require('supertest');
const app = require('../lib/app');

let person = null;
const expectedPerson = {
  id: 1,
  name: 'shabz',
  age: 26,
  color: 'red',
  faveCharId: 1,
  faveChar: {
    name: 'Luke Skywalker',
    height: '172',
    mass: '77',
    hairColor: 'blond',
    birthYear: '19BBY'
  }
};
describe('people', () => {
  beforeEach(done => {
    request(app)
      .post('/people')
      .send({
        id: 1,
        name: 'shabz',
        age: 26,
        color: 'red',
        faveCharId: 1
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
        1: expectedPerson
      }));
  });

  it('gets person by id', () => {
    return request(app)
      .get(`/people/${person.id}`)
      .then(res => expect(JSON.parse(res.text)).toEqual(expectedPerson));
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
        color: 'red',
        faveCharId: 9
      })
      .then(res => expect(JSON.parse(res.text)).toEqual({
        id: 1,
        name: 'shabster',
        age: 36,
        color: 'red',
        faveCharId: 9,
        faveChar: {
          name: 'Biggs Darklighter', 
          height: '183', 
          mass: '84', 
          hairColor: 'black', 
          birthYear: '24BBY'
        }
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
