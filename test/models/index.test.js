const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const Store = require('../lib/index');

describe.only('Store', () => {
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
    store.create({ movie: 'lord of the rings' }, (err, createdMovie) => {
      expect(err).toBeFalsy();
      expect(createdMovie).toEqual({ movie: 'lord of the rings', _id: expect.any(String) });
      store.findById(createdMovie._id, (err, foundMovie) => {
        expect(foundMovie).toEqual(createdMovie);
      });
      done();
    });
  });

  it('finds an object in the store by id', done => {
    store.create({ movie: 'Homeward Bound' }, (err, createdMovie) => {
      store.findById((createdMovie._id), (err, foundMovie) => {
        expect(err).toBeFalsy();
        expect(foundMovie).toEqual({ movie: 'Homeward Bound', _id: createdMovie._id });
        done();
      });
    });
  });

  it('can return null if it is passed a nonexisting id', done => {
    store.findById('4221', (err, foundMovie) => {
      expect(err).toBeTruthy();
      expect(foundMovie).toBeNull();
      done();
    });
  });

  it('can find an object in the store by id and delete it', done => {
    store.create({ movie: 'Home Alone' }, (err, createdMovie) => {
      store.findByIdAndDelete(createdMovie._id, (err, deletedMovie) => {
        expect(err).toBeFalsy();
        expect(deletedMovie).toEqual({ deleted: 1 });
        store.findById(createdMovie._id, (err, foundItem) => {
          expect(err).toBeTruthy();
          expect(foundItem).toBeNull();
          done();
        });
      });
    });
  });

  it('can return deleted:0 when given a non-existing id with the delete method', () => {
    store.findByIdAndDelete('1234', (err, deletedMovie) => {
      expect(err).toBeTruthy();
      expect(deletedMovie).toEqual({ deleted: 0 });
    });
  });

  it('can return an array of all the objects in the directory', done => {
    store.create({ movie: 'Air Bud' }, (err, item1) => {
      store.create({ movie: 'Home Alone' }, (err, item2) => {
        store.create({ movie: 'Lion King' }, (err, item3) => {
          store.create({ movie: 'Sword In The Stone' }, (err, item4) => {
            store.create({ movie: 'Little Mermaid' }, (err, item5) => {
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
