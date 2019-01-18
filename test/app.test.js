const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const request = require ('supertest');
const app = require('../lib/app');

const createPerson = (name) => {
  return request(app)
    .post('/people') //execute a post
    .send({ //send this data
      name: name,
      age: 100,
      favoriteColor: 'red'
    })
    .then(res => res.body); //to only get the json
};


describe('app test', () => {
  beforeEach(done => {
    rimraf('./data/people', err => { //remove the people directory
      done(err); 

    });
  });

  beforeEach(done => {
    mkdirp('./data/people', err => { //makes the directory with data and people
      done(err); 
      //mkdirp('./data/people, done)done is function that takes error
    });
  });


  it('creates a person', () => {
    return request(app) //this lets gets know it's a promise
      .post('/people') //execute a post
      .send({ //send this data
        name: 'Uncle bob',
        age: 100,
        favoriteColor: 'red'
      })
      .then(res => {
        expect(res.body).toEqual({ //expecting the body we posted and expect the data{}
          name: 'Uncle bob',
          age: 100,
          favoriteColor: 'red',
          _id: expect.any(String)
        });
      });
  });

  it('gets a list of people from our db', () => {
    const namesToCreate = ['ryan', 'ryan1', 'ryan2']; //names of people want to create
    return Promise.all(namesToCreate.map(createPerson)) //map through it to crate a person. want to fulfill promise before moving to the next step
      .then(() => { //after all created we expect to get a list of all people created
        return request(app)
          .get('/people');
      })
      .then(({ body }) => { //destructor body to not res and res.body
        expect(body).toHaveLength(3);
      });
  });
  // return Array.from(Array(10)) //creates an array with 10 people
  it('gets a person by id', () => {
    return createPerson('Uncle Bob')
      .then((createdPerson) => { //(_id)
        const id = createdPerson._id;
        return request(app)
          .get(`/people/${id}`);
      })
      .then(res => {
        expect(res.body).toEqual({    
          name: 'Uncle Bob',
          age: 100,
          favoriteColor: 'red',
          _id: expect.any(String)
        }); //Another way to obtain expect(res.body.name).toEqual(res.body_id);
      });
  });

  it('updates a person by id', () => {
    return createPerson('maria')
      .then((createdPerson) => {
        const id = createdPerson._id;
        return request (app)
          .put(`/people/${id}`)
          .send({ 
            name: 'Maria',
            age: 100,
            favoriteColor: 'blue',
            _id: expect.any(String)
          })
          .then(res => {
            expect(res.body.name).toEqual({
              name: 'Maria',
              age: 100,
              favoriteColor: 'blue',
              _id: expect.any(String)
            });
          });
      });
  });
});
