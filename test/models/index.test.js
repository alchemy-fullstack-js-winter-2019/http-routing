const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const Store = require('../../lib/models/index');

describe('Store', () => {
  let store = null;
  beforeEach(done => {
    //clear out all files before you start testing using rimraf node module then call done
    rimraf('./testData/store', err => {
      done(err);
    });
  });

  beforeEach(done => {
    //make new directories using mkdirp node module then call done
    mkdirp('./testData/store', err => {
      done(err);
    });
  });

  beforeEach(() => {
    //tell it where to save stuff 
    store = new Store('./testData/store');
  });

  it('creates an object in my store', done => {
    //use the create function to make a new object in the store - return a falsy error and return the new object
    store.create({ snack: 'plaintain chips' }, (err, createdSnack) => {
      expect(err).toBeFalsy();
      expect(createdSnack).toEqual({ snack: 'plaintain chips', _id: expect.any(String) });
      done(err);
    });
  });

  it('finds an object by id', done => {
    store.create({ snack: 'plaintain chips' }, (err, createdSnack) => {
      const id = createdSnack._id;
      store.findById(id, (err, foundSnack) => {
        expect(err).toBeFalsy();
        expect(foundSnack).toEqual({ snack: 'plaintain chips', _id: id });
        done(err);
      });
    });
  });

  it('finds an object by id and deletes the object', done => {
    store.create({ snack: 'almonds' }, (err, createdSnack) => {
      const id = createdSnack._id;
      store.findByIdAndDelete(id, (err, foundSnack) => {
        expect(err).toBeFalsy();
        expect(foundSnack).toEqual({ deleted: 1 });
        done(err);
      });
    });
  });

  it('finds all objects tracked by the store', done => {
    store.create({ snack: 'mango' }, (err, mangoSnack) => {
      store.create({ snack: 'popcorn' }, (err, popcornSnack) => {
        store.create({ snack: 'cheese' }, (err, cheeseSnack) => {
          store.create({ snack: 'kale chips' }, (err, kaleChipsSnack) => {
            store.create({ snack: 'banana' }, (err, bananaSnack) => {
              store.find((err, snackArray) => {
                expect(err).toBeFalsy();
                expect(snackArray).toHaveLength(5);
                expect(snackArray).toContainEqual(mangoSnack);
                expect(snackArray).toContainEqual(popcornSnack);
                expect(snackArray).toContainEqual(cheeseSnack);
                expect(snackArray).toContainEqual(kaleChipsSnack);
                expect(snackArray).toContainEqual(bananaSnack);
                done();
              });
            });
          });
        });
      });
    });
  });

  it('finds an object by id and updates it', done => {
    store.create({ snack: 'mango' }, (err, createdWrongSnack) => {
      store.findByIdAndUpdate(createdWrongSnack._id, { snack: 'cashews' }, (err, updatedRightSnack) => {
        expect(err).toBeFalsy();
        expect(updatedRightSnack).toEqual({ snack: 'cashews', _id: createdWrongSnack._id });
        store.findById(createdWrongSnack._id, (err, foundSnack) => {
          expect(err).toBeFalsy();
          expect(foundSnack).toEqual(updatedRightSnack);
          done();
        });
      });
    });
  });
});
