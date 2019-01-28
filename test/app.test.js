const app = require('../lib/app');
const request = require('supertest');

describe('routes', () => {
  it('displays an error when path not found', () => {
    return request(app)
      .get('/banana')
      .then(res => {
        expect(res.statusCode).toEqual(404);
      });
  });
});
