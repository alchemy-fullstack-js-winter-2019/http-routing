const request = require('superagent');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');

const createPerson = name => {
  return request
    .post('http://localhost:7890/people')
    .send({
      name,
      age: 99,
      color: 'red'
    })
    .then(res => console.log('res', res.request._data));
};


describe('app tests', () => {
  beforeEach(done => {
    rimraf('./data/people', err => {
      done(err);
    });
  });

  beforeEach(done => {
    mkdirp('./data/people', err => {
      done(err);
    });
  });

  it('gets list of people', () => {
    return createPerson('shabz')
      .then(person => {
        request
          .get('http://localhost:7890/people')
          .then(result => expect(JSON.parse(result.text)).toEqual(person));
      });
  });
});
