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
    store.create({ name: 'Aaron' }, (err, createdPerson) => {
      expect(err).toBeFalsy();
      expect(createdPerson).toEqual({ name: 'Aaron', _id: expect.any(String) });
      done();
    });
  });

  it('finds an object by id', done => {
    store.create({ name: 'Pete' }, (err, createdPerson) => {
      store.findById(createdPerson._id, (err, foundPerson) => {
        expect(err).toBeFalsy();
        expect(foundPerson).toEqual({ name: 'Pete', _id: createdPerson._id });
        done();
      });
    });
  });

  it('deletes an object with that id', done => {
    store.create({ item: 'deleting item' }, (err, createdItem) => {
      store.findByIdAndDelete(createdItem._id, (err, result) => {
        expect(err).toBeFalsy();
        expect(result).toEqual({ deleted: 1 });
        store.findById(createdItem._id, (err, foundItem) => {
          expect(err).toBeTruthy();
          expect(foundItem).toBeFalsy();
          done();
        });
      });
    });
  });

  it('returns deleted:0 when given an id that does not exist', () => {
    store.findByIdAndDelete('badId', (err, deletedItem) => {
      expect(err).toBeTruthy();
      expect(deletedItem).toEqual({ deleted: 0 });
    });
  });

  it('finds all objects in the store', done => {
    store.create({ item: 1 }, (err, item1) => {
      store.create({ item: 2 }, (err, item2) => {
        store.create({ item: 3 }, (err, item3) => {
          store.create({ item: 4 }, (err, item4) => {
            store.find((err, listOfItems) => {
              expect(err).toBeFalsy();
              expect(listOfItems).toHaveLength(4);
              expect(listOfItems).toContainEqual(item1);
              expect(listOfItems).toContainEqual(item2);
              expect(listOfItems).toContainEqual(item3);
              expect(listOfItems).toContainEqual(item4);
              done();
            });
          });
        });
      });
    });
  });
});
