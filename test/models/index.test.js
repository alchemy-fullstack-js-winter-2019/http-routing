const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const Store = require('../lib/index');

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

  it('creates object in store', done => {
    store.create({ name: 'Cari' }, (err, person) => {
      expect(err).toBeFalsy();
      expect(person).toEqual({ name: 'Cari', _id: expect.any(String) });
      done();
    });
  });


  it('finds an object by id', done => {
    store.create({ name: 'Bobby' }, (err, person) => {
      store.findById(person._id, (err, foundPerson) => {
        expect(err).toBeFalsy();
        expect(foundPerson).toEqual({ name: 'Bobby', _id: person._id });
        done();
      });
    });
  });
  it('throws error if id does not exist', done => {
    store.findById(123456, (err, foundPerson) => {
      expect(err).toBeTruthy();
      expect(!foundPerson).toBeTruthy();
      done();
    });
  });


  it('can find an item by id and delete it', done => {
    store.create({ name: 'Booboo' }, (err, person) => {
      store.findById(person._id, (err, foundPerson) => {
        store.findByIdAndDelete(foundPerson._id, (err, removedSuccessObject) => {
          expect(err).toBeFalsy();
          expect(removedSuccessObject).toEqual({ deleted: 1 });
          done();
        });
      });
    });
  });


  it('can find all objects tracked by the store', done => {
    store.create({ name: 'Bobby' }, (err, person1) => {
      store.create({ name: 'Sally' }, (err, person2) => {
        store.create({ name: 'Muffin' }, (err, person3) => {
          store.create({ name: 'Frankie' }, (err, person4) => {
            store.create({ name: 'Potato' }, (err, person5) => {
              store.find((err, listOfItems) => {
                expect(err).toBeFalsy();
                expect(listOfItems).toHaveLength(5);
                expect(listOfItems).toContainEqual(person1);
                expect(listOfItems).toContainEqual(person2);
                expect(listOfItems).toContainEqual(person3);
                expect(listOfItems).toContainEqual(person4);
                expect(listOfItems).toContainEqual(person5);
                done();
              });
            });
          });
        });
      });
    });
  });

  it('updates an existing object', done => {
    store.create({ name: 'BooBoo' }, (err, createdObject) => {
      store.findByIdAndUpdate(createdObject._id, { name: 'BamBam' }, (err, updatedObject) => {
        expect(err).toBeFalsy();
        expect(updatedObject).toEqual({ name: 'BamBam', _id: createdObject._id });
        store.findById(createdObject._id, (err, foundObject) => {
          expect(foundObject).toEqual(updatedObject);
          done();
        });
      });
    });
  });

});
