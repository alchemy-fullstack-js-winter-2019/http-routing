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
    store.create({ name: 'itchy' }, (err, createdPerson) => {
      expect(err).toBeFalsy();
      expect(createdPerson).toEqual({ name: 'itchy', _id: expect.any(String) });
      done();

    });
  });
  //Find Object by ID
  it('finds an object by id', done => {
    store.create({ name: 'Scratchy' }, (err, createdPerson) => {
      store.findById(createdPerson._id, (err, foundPerson) => {
        expect(err).toBeFalsy();
        expect(foundPerson).toEqual({ name: 'Scratchy', _id: createdPerson._id });
        done();
      });
    });
  });
  it('throws error if id does not exist', done => {
    store.findById(1001, (err, foundPerson) => {
      expect(err).toBeTruthy();
      expect(!foundPerson).toBeTruthy();
      done();
    });
  });

  it('find all objects tracked by the store', done => {
    store.create({ item: 1 }, (err, item_01) => {
      store.create({ item: 1 }, (err, item_02) => {
        store.create({ item: 1 }, (err, item_03) => {
          store.create({ item: 1 }, (err, item_04) => {
            store.create({ item: 1 }, (err, item_05) => {
              store.find((err, listOfItems) => {
                expect(err).toBeFalsy();
                expect(listOfItems).toHaveLength(5);
                expect(listOfItems).toContainEqual(item_01);
                expect(listOfItems).toContainEqual(item_02);
                expect(listOfItems).toContainEqual(item_03);
                expect(listOfItems).toContainEqual(item_04);
                expect(listOfItems).toContainEqual(item_05);
                done();
              });
            });
          });
        });
      });
    });
  });

  //Find By ID and Delete:
  it('deletes an object with an id', done => {
    store.create({ name: 'scratchy' }, (err, createdPerson) => {
      store.findById(createdPerson._id, (err, createdPerson) => {
        store.findByIdAndDelete(createdPerson._id, (err, removedPerson) => {
          expect(err).toBeFalsy();
          expect(removedPerson).toEqual({ deleted: 1 });
          done();
        });
      });
    });
  });

  //Find By ID and Update:
  it('updates an existing object', () => {
    store.create({ name: 'itchy' }, (err, updatePerson) => {
      store.findByIdAndUpdate(updatePerson._id, { name: 'Scratchy' }, (error, updatedPerson) => {
        expect(err).toBeFalsy();
        expect(updatedPerson).toEqual({ name: 'Scratchy', _id: updatePerson._id });
        store.findById(updatedPerson._id, (err, createdPerson) => {
          expect(createdPerson).toEqual(updatedPerson);
        });
      });
    });
  });

}); 
