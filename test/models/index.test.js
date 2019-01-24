const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const Store = require('../../lib/models/index');


describe('Store', () => {
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

  it('creates an object in my store', done => {
    store.create({ name: 'Carmen' }, (err, createdPerson) => {
      expect(err).toBeFalsy();
      expect(createdPerson).toEqual({ name: 'Carmen', _id: expect.any(String) });
      done();
    });
  });

  it('finds an object by id', done => {
    // create an object
    store.create({ name: 'Carmen' }, (err, createdObj) => {
      // after done creating -> findBy Id
      store.findById(createdObj._id, (err, foundObj) => {
        // after found check that it is the same one that we created
        expect(err).toBeFalsy();
        expect(foundObj).toEqual({ name: 'Carmen', _id: createdObj._id });
        // call done
        done();
      });
    });
  });

  it('find all objects tracked by the store', done => {
    // create a bunch of objects (at least 5)
    store.create({ name: 'Carmen' }, (err, createdObj1) => {
      store.create({ name: 'Carly' }, (err, createdObj2) => {
        store.create({ name: 'Carla' }, (err, createdObj3) => {
          store.create({ name: 'Carina' }, (err, createdObj4) => {
            store.create({ name: 'Carmela' }, (err, createdObj5) => {
              store.find((err, foundObjects) => {
                expect(err).toBeFalsy();
                expect(foundObjects).toHaveLength(5);
                expect(foundObjects).toContainEqual(createdObj1);
                expect(foundObjects).toContainEqual(createdObj2);
                expect(foundObjects).toContainEqual(createdObj3);
                expect(foundObjects).toContainEqual(createdObj4);
                expect(foundObjects).toContainEqual(createdObj5);
                done();
              });
            });
          });   
        });
      }); 
    });
  });

  it('finds an object by Id and deletes it', done => {
    store.create({ name: 'Carmen' }, (err, createdObj) => {
      store.findByIdAndDelete(createdObj._id, (err, result) => {
        expect(err).toBeFalsy();
        expect(result).toEqual({ deleted: 1 });
        store.findById(createdObj._id, (err, foundObj) => {
          expect(err).toBeTruthy();
          expect(foundObj).toBeFalsy();
          done();
        });
      }); 
    });
  });

  it('updates an existing object', done => {
    // store.create
    store.create({ name: 'Carman' }, (err, createdObject) => {
      // store.findByIdAndUpdate(createdObject._id, updatedObject, callback)
      // expect updatedObject returned in callback
      store.findByIdAndUpdate(createdObject._id, { name: 'Carmen' }, (err, result) => {
        expect(err).toBeFalsy();
        expect(result).toEqual({ name: 'Carmen', _id: createdObject._id });
        // store.findById(createdObject._id)
        store.findById(createdObject._id, (err, updatedObject) => {
          // expect updated object
          expect(err).toBeFalsy();
          expect(updatedObject).toEqual(result);
          done();
        }); 
      });
      
    });
  });
});
