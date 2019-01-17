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
    store.create({ name: 'peter' }, (err, createdPerson) => {
      expect(err).toBeFalsy();
      expect(createdPerson).toEqual({ name: 'peter', _id: expect.any(String) });
      done();
    });  
  });

  it('can find an object by id', done => {
    store.create({ name: 'babs' }, (err, createdPerson) => {
      store.findById(createdPerson._id, (err, foundPerson) => {
        expect(err).toBeFalsy();
        expect(foundPerson).toEqual({ name: 'babs', _id: createdPerson._id });
        done();
      });
    });
  });

  it('throws an error when there is no obj at that id', () => {
    store.findById(1234, (err) => {
      expect(err).toBeTruthy();
    });
  });

  it('can find an object by id and delete it', done => {
    store.create({ name: 'babs' }, (err, createdPerson) => {
      store.findById(createdPerson._id, (err, foundPerson) => {
        store.findByIdAndDelete(foundPerson._id, (err, removedPerson) => {
          expect(err).toBeFalsy();
          expect(removedPerson).toEqual({ deleted: 1 });
          done();
        });
      });
    });
  });

  it('can find an object by id and update', done => {
    store.create({ name: 'babs' }, (err, nickName) => {
      store.findByIdAndUpdate(nickName._id, { name: 'barbara' }, (err, updatedPerson) => {
        expect(err).toBeFalsy();
        // expect(updatedPerson._id).toEqual(nickName._id);
        expect(updatedPerson).toEqual({ name: 'barbara', _id: nickName._id });
        store.findById(nickName._id, (err, foundPerson) => {
          expect(foundPerson).toEqual(updatedPerson);
        });
        done();
      });
    });
  });

  it('can find all objects tracked by the store', done => {
    store.create({ name: 'bob ross' }, (err, bob1) => {
      store.create({ name: 'uncle bob' }, (err, bob2) => {
        store.create({ name: 'sponge bob' }, (err, bob3) => {
          store.create({ name: 'billy bob thorton' }, (err, bob4) => {
            store.create({ name: 'bobby mcfadden' }, (err, bob5) => {
              store.find((err, listOfItems) => {
                expect(err).toBeFalsy();
                expect(listOfItems).toHaveLength(5);
                expect(listOfItems).toContainEqual(bob1);
                expect(listOfItems).toContainEqual(bob2);
                expect(listOfItems).toContainEqual(bob3);
                expect(listOfItems).toContainEqual(bob4);
                expect(listOfItems).toContainEqual(bob5);
                done();
              });
            });
          });
        });
      });
    });       
  });
});