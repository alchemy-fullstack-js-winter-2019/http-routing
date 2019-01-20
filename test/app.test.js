const request = require('supertest');
const app = require('../lib/app');

describe('app', () => {
  it('gets list of people', () => {
    return request(app)
      .get('/people')
      .then(res => expect(JSON.parse(res.text)).toEqual([
        { 'id':0, 'name':'Bob', 'age':104, 'color':'brown' },
        { 'id':1, 'name':'Shirly', 'age':18, 'color':'blue' }
      ]));
  });
});
