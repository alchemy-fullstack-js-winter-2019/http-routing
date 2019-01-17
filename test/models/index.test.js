const { Store } = require('../../lib/models/index');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf'); 


describe('database', () => {
  let store = null;
  beforeEach((done) => {
    rimraf('./testData/store', err => {
      done(err);
    });
  }); 
  beforeEach((done) => {
    mkdirp('./testData/store', err => {
      done(err);
    });
  });
  beforeEach(() => {
    store = new Store('./testData/store');
  });
  it('creates an object in my store', done => {
    store.create({ name: 'toy' }, (err, createdItem) => {
      expect(err).toBeFalsy();
      expect(createdItem).toEqual({ name: 'toy', _id: expect.any(String) });
      done();
    });
  });
  it('should be able to find an item by the id', done => {
    store.create({ name: 'toy' }, (err, createdItem) => {
      store.findById(createdItem._id, (err, foundItem) => {
        expect(err).toBeFalsy();
        expect(foundItem).toEqual({ name: 'toy', _id: foundItem._id });
        done();
      });
    });
  });
  it('should find by ID and update with another obj', done => {
    store.create({ name: 'toi' }, (err, createdItem) => {
      store.findByIdAndUpdate(createdItem._id, { name: 'toy' }, (err, updatedItem) => {
        expect(err).toBeFalsy();
        expect(updatedItem).toEqual({ name: 'toy', _id: updatedItem._id }); 
        store.findById(updatedItem._id, (err, newItem) => {
          expect(err).toBeFalsy(); 
          expect(newItem).toEqual(updatedItem); 
        }); 
        done();
      }); 
    });
  });
  it('should be able to find item and delete', done => {
    store.create({ name: 'toy' }, (err, createdItem) => {
      store.findByIdAndDelete(createdItem._id, (err, deletedItem) => {
        expect(err).toBeFalsy();
        expect(deletedItem).toEqual({ deleted: 1 });
        done(); 
      });
    });
  });
  it('should return all an array of all the objects in a directory', done => {
    store.create({ name: 'toy' }, (err, item1) => {
      store.create({ name: 'teddybear' }, (err, item2) => {
        store.create({ name: 'candycane' }, (err, item3) => {
          store.create({ name: 'ball' }, (err, item4) => {
            store.create({ name: 'doll' }, (err, item5) => {
              store.find((err, allItems) => {
                expect(err).toBeFalsy();
                expect(allItems).toHaveLength(5);
                expect(allItems).toContainEqual(item1);
                expect(allItems).toContainEqual(item2);
                expect(allItems).toContainEqual(item3);
                expect(allItems).toContainEqual(item4);
                expect(allItems).toContainEqual(item5);

                done();
              });
            });
          });
        });
      });
    });
  });
});
