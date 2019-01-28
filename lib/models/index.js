const shortId = require('shortid');
const fs = require('fs');

class Store {
  constructor(rootDir) {
    this.rootDir = rootDir;

  }

  create(obj, callback) {
    const _id = shortId.generate();
    const objWithId = { ...obj, _id };
    const objWithIdStr = JSON.stringify(objWithId);

    fs.writeFile(`${this.rootDir}/${_id}`, objWithIdStr, err => {
      callback(err, objWithId);
    });
  }

  findById(_id, callback) {
    fs.readFile(`${this.rootDir}/${_id}`, { encoding: 'utf8' }, (err, data) => {
      try {
        const obj = JSON.parse(data);
        callback(err, obj);
      } catch(e) {
        callback(e);
      }
    });
  }

  findByIdAndDelete(_id, callback) {
    fs.unlink(`${this.rootDir}/${_id}`, err => {
      try {
        callback(err, { deleted: 1 });
      } catch(err) {
        callback(err, { deleted: 0 });
      }
    });
  }

  findByIdAndUpdate(_id, updatedObject, callback) {
    this.findById(_id, err => {
      if(err) return callback(err);
      const objToWrite = { ...updatedObject, _id };
      const objToWriteStr = JSON.stringify(objToWrite);
      fs.writeFile(`${this.rootDir}/${_id}`, objToWriteStr, err => {
        callback(err, objToWrite);
      });
    });
  }

  find(callback) {
    fs.readdir(this.rootDir, (err, listOfAllIds) => {
      let count = listOfAllIds.length;
      if(count < 1) return callback(err, []);

      const items = [];
      listOfAllIds.forEach(_id => {
        this.findById(_id, (err, item) => {
          count--;
          items.push(item);
          if(count === 0) callback(null, items);
        });
      });
    });
  }
}

module.exports = Store;
