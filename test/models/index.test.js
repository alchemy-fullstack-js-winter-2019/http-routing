
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
    store.create({ name: 'ryan' }, (err, createdPerson) => {
      expect(err).toBeFalsy();
      expect(createdPerson).toEqual({ name: 'ryan', _id: expect.any(String) });
      done();
    });
  });

  it('finds an object by id', done => {
    store.create({ name: 'Niko' }, (err, createdDog) => {
      store.findById(createdDog._id, (err, foundDog) => {
        expect(err).toBeFalsy();
        expect(foundDog).toEqual({ name: 'Niko', _id: createdDog._id });
        done();
      });
    });
  });

  
  it('find all objects tracked by the store', done => {
    store.create({ item: 1 }, (err, item1) => {
      store.create({ item: 2 }, (err, item2) => {
        store.create({ item: 3 }, (err, item3) => {
          store.create({ item: 4 }, (err, item4) => {
            store.create({ item: 5 }, (err, item5) => {
              store.find((err, listOfItems) => {
                expect(err).toBeFalsy();
                expect(listOfItems).toHaveLength(5);
                expect(listOfItems).toContainEqual(item1);
                expect(listOfItems).toContainEqual(item2);
                expect(listOfItems).toContainEqual(item3);
                expect(listOfItems).toContainEqual(item4);
                expect(listOfItems).toContainEqual(item5);
                done();
              });
            });
          });
        });
      });
    });
  });

  it('deletes an object with an id', done => {
    store.create({ item: 'I am going to delete' }, (err, createdItem) => {
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

  it('updates an object with an id', done => {
    store.create({ item: 'I am going to update' }, (err, createdItem) => {
      store.findByIdAndUpdate(createdItem._id, { item: 'I am updated' }, (err, result) => {
        expect(err).toBeFalsy();
        expect(result).toEqual({ _id: createdItem._id, item: 'I am updated' });
        store.findById(createdItem._id, (err, updatedItem) => {
          expect(updatedItem).toEqual(result);
          done();
        });
      });
    });
  });
});
