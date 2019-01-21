const request = require('supertest');
const app = require('../lib/app');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');

const createCar = (brand) => {
    return request(app)
        .post('/cars')
        .send({
            brand: brand,

        })
        .then(res => res.body);

};
describe('test cars routes', () => {
    beforeEach(done => {
        rimraf('./data/cars', err => {
            done(err);
        });
    });
    beforeEach(done => {
        mkdirp('./data/cars', err => {
            done(err);
        });
    });
    it('can create new cars', () => {
        return request(app)
            .post('/cars')
            .send({
                brand: 'tesla'
            })
            .then(res => {
                expect(res.body).toEqual({
                    brand: 'tesla',
                    _id: expect.any(String)
                    
                });
            });
    });
    //next it 
    it('can test the GET method', () => {
        const carsToCreate = ['toyota', 'honda', 'bmw'];
        return Promise.all(carsToCreate.map(createCar))
            .then(() => {
                return request(app)
                    .get('/cars');
            })
            .then(({ body }) => {
                expect(body).toHaveLength(3);
            });
    });

    it('gets a person by id', () => {
        return createCar('bmw')
            .then(createdCar => {
                const id = createdCar._id;
                return request(app)
                    .get(`/cars/${id}`);
            })
            .then(({ body }) => {
                expect(body.brand).toContain('bmw');
            });
    });
    it('can find by id and update a person', () => {
        return createCar('BMW')
            .then(createdCar => {
                const id  = createdCar._id;
                createdCar.name = 'lanceUPDATED';
                return request(app)
                    .put(`/cars/${id}`)
                    .send(createdCar);
            })
            .then(({ body }) => {
                expect(body.name).toContain('lanceUPDATED');
            });
    });
    it('can delete a file/person', () => {
        return createCar('BMW')
            .then(createdCar => {
                const id = createdCar._id;
                return request(app)
                    .delete(`/cars/${id}`);
            })
            .then(({ body }) => {
                expect(body).toEqual({ 'deleted' : 1 });
            });
    });






});

