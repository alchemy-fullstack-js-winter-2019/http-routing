const Store = require('../../lib/models/index');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');

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

  it('creates an object', done => {
    store.create({ name: 'abel' }, (err, createdPerson) => {
      expect(err).toBeFalsy();
      expect(createdPerson).toEqual({ name: 'abel', _id: expect.any(String) });
      done();
    });
  });

  it('finds an object by id', done => {
    //create an object (use same method)
    store.create({ name: 'uncle bob' }, (err, createdUncle) => {
      store.findById(createdUncle._id, (err, foundUncle) => {
        expect(err).toBeFalsy();
        expect(foundUncle).toEqual({ name: 'uncle bob', _id: createdUncle._id });

        done();
      });
    });

  });

  it('throws an error if id does not exist', () => {
    
    store.findById(1234, (err) => {
      expect(err).toBeTruthy();
        
    });
  });


  it('finds an object by id and delete if object is removed', done => {
    store.create({ name: 'uncle bob' }, (err, createdUncle) => {
      store.findById(createdUncle._id, (err, foundUncle) => {
        store.findByIdAndDelete(foundUncle._id, (err, deletedUncle) => {
          expect(err).toBeFalsy();
          expect(deletedUncle).toEqual({ deleted: 1 });
          done();
        });

      });
    }); 
  });
    

  it('find all objects tracked by the store', done => {
  // create at least 5 objects
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

});
