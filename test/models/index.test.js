const Store = require('../../lib/models/index');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');


describe('store', () => {
    let store = null;
    beforeEach(done => {
        rimraf('./testData/store', err => {
            done(err);
        });
    });
    beforeEach(done => {
        mkdirp('./testData/store', err => {
            done(err);
        });
    });
    beforeEach(() => {
        store = new Store('./testData/store');
    });

    it('can create a new file', done => {
        store.create({ tweet: 'hello World' }, (err, createdTweet) => {
            expect(err).toBeFalsy();
            expect(createdTweet).toEqual({ tweet: 'hello World', _id: expect.any(String) });
            done();
        });
    });

    it('finds an object by id', done => {
        store.create({ tweet: 'hello World' }, (err, createdTweet) => {

            store.findById(createdTweet._id, (err, objectFromFile) => {
                expect(err).toBeFalsy();
                expect(objectFromFile).toEqual({ tweet: 'hello World', _id: createdTweet._id });
                done();
            });
        });
    });

    it(' can delete an object by id', done => {
        store.create({ tweet: 'hello World' }, (err, createdTweet) => {
            store.findByIdAndDelete(createdTweet._id, (err, deletedObject) => {
                expect(err).toBeFalsy();
                expect(deletedObject).toEqual({ deleted: 1 });
                done();

            });
        });
    });
    it('updates an existing object', done => {
        // store.create
        store.create({ name: 'rayn' }, (err, typoCreated) => {
            // -> store.findByIdAndUpdate(createdObject._id, updatedObject, callback)
            store.findByIdAndUpdate(typoCreated._id, { name: 'ryan' }, (err, updatedWithoutTypo) => {
            // -> -> expect updatedObject returned in callback
                expect(err).toBeFalsy();
                expect(updatedWithoutTypo).toEqual({ name: 'ryan', _id: typoCreated._id });
                // -> -> store.findById(createdObject._id)
                store.findById(typoCreated._id, (err, foundObj) => {
                    // -> -> -> expect updated object
                    expect(foundObj).toEqual(updatedWithoutTypo);
                    done();
                });
    
            });
        });
    });

    it('can return an array of objects from all files', done => {
        store.create({ tweet: 'hello hong kong' }, (err, createdTweet1) => {
            store.create({ tweet: 'hello tokyo' }, (err, createdTweet2) => {
                store.create({ tweet: 'hello paris' }, (err, createdTweet3) => {
                    store.create({ tweet: 'hello PDX' }, (err, createdTweet4) => {
                        store.create({ tweet: 'hello World' }, (err, createdTweet5) => {
                            store.find((err, list) => {
                                expect(err).toBeFalsy();
                                expect(list).toHaveLength(5);
                                expect(list).toContainEqual(createdTweet1);
                                expect(list).toContainEqual(createdTweet2);
                                expect(list).toContainEqual(createdTweet3);
                                expect(list).toContainEqual(createdTweet4);
                                expect(list).toContainEqual(createdTweet5);

                                done();
                            }); 
                        });
                    });
                });
            });
        });
    });
});

