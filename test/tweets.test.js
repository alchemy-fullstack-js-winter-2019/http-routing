const request = require('supertest');
const app = require('../lib/app');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');

const createTweet = (handle) => {
    return request(app)
        .post('/tweets')
        .send({
            tweet: 'KAAACAHHH',
            handle: handle
        })
        .then(res => {
            return res.body;
        });
};

describe('it test tweet routes', () => {
    beforeEach(done => {
        rimraf('./data/tweets', err => {
            done(err);
        });
    });
    beforeEach(done => {
        mkdirp('./data/tweets', err => {
            done(err);
        });
    });

    it('can create a new tweet', () => {
        return request(app)
            .post('/tweets')
            .send({
                tweet: 'hello',
                handle: 'kananiboy'
            })
            .then(res => {
                expect(res.body).toEqual({
                    tweet: 'hello',
                    handle: 'kananiboy', 
                    _id: expect.any(String)
                });
            });
    });

    it('can gets all', () => {
        const handlesToCreate = ['kananiboy', 'kananiboy2', 'kananiboy3'];
        return Promise.all(handlesToCreate.map(createTweet))
            .then(() => {
                return request(app)
                    .get('/tweets');
            })
            .then(({ body }) => {
                expect(body).toHaveLength(3);
            });
    });


    it('gets a tweet by id', () => {
        return createTweet('HANDLE')
            .then(createdTweet => {
                const id = createdTweet._id;
                return request(app)
                    .get(`/tweets/${id}`);
            })
            .then(({ body }) => {
                expect(body.handle).toContain('HANDLE');
            });
    });
    it('can find by id and update a person', () => {
        return createTweet('BILL')
            .then(createdTweet => {
                const id  = createdTweet._id;
                createdTweet.handle = 'BILLUPDATED';
                return request(app)
                    .put(`/tweets/${id}`)
                    .send(createdTweet);
            })
            .then(({ body }) => {
                expect(body.handle).toContain('BILLUPDATED');
            });
    });
    it('can delete a file/person', () => {
        return createTweet('lance50')
            .then(createTweet => {
                const id = createTweet._id;
                return request(app)
                    .delete(`/tweets/${id}`);
            })
            .then(({ body }) => {
                expect(body).toEqual({ 'deleted' : 1 });
            });
    });









});


