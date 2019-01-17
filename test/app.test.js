const request = require('supertest');
const app = require('../lib/app');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');

const createPerson = (name) => {
    return request(app)
        .post('/people')
        .send({
            name: name,
            age: 100,
            favoriteColor: 'red'
        })
        .then(res => res.body);

};

describe('it test various rest methods', () => {
    
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
    it('can create new people', () => {
        return request(app)
            .post('/people')
            .send({
                name: 'Uncle bob',
                age: 100,
                favoriteColor: 'red',
            })
            .then(res => {
                expect(res.body).toEqual({
                    name: 'Uncle bob',
                    age: 100,
                    favoriteColor: 'red', 
                    _id: expect.any(String)
                    
                });
            });

    });
    it('can test the GET method', () => {
        const namesToCreate = ['lance', 'lance1', 'lance2'];
        return Promise.all(namesToCreate.map(createPerson))
            .then(() => {
                return request(app)
                    .get('/people');
            })
            .then(res => {
                expect(res.body).toHaveLength(3);
            });
    });

    it('gets a person by id', () => {
        return request(app)
            .get('/people')
            .then(res => {
                expect(res.body).toContain('lance1');

            });
    });
});

