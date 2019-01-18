const request = require('superagent');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
// const shortId = require('shortid');

// const createPerson = name => {
//   return request
//     .post('http://localhost:7890/people')
//     .send({
//       name,
//       age: 99,
//       color: 'red',
//       id: shortId.generate()
//     })
//     .then(res => res.request._data);
// };


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
    // return createPerson('shabz')
    //   .then(person => {
    request
      .get('http://localhost:7890/people')
      .then(result => expect(JSON.parse(result.text)).toEqual([{ 'id':0, 'name':'Bob', 'age':104, 'color':'brown' }, { 'id':1, 'name':'Shirly', 'age':18, 'color':'blue' }]
      ));
    // });
  });
});
