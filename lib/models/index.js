const shortId = require('short-id');
const fs = require('fs');

class Store {
  constructor(rootDir) {
    this.rootDir = rootDir;
  }

  create(objectToSave, callback) {
    const _id = shortId.generate();
    const copiedObj = { ...objectToSave, _id };
    const strObj = JSON.stringify(copiedObj);
    fs.writeFile(`${this.rootDir}/${_id}`, strObj, err => {
      try {
        callback(err, copiedObj);
      }
      catch(err) {
        callback(err, null);
      }
    });
  }

  findById(_id, callback) {
    fs.readFile(`${this.rootDir}/${_id}`, { encoding: 'utf8' }, (err, data) => {
      try {
        const objectFromFile = JSON.parse(data);
        callback(err, objectFromFile);
      }
      catch(err) {
        callback(err, null);
      }
    });
  }

  findByIdAndDelete(_id, callback) {
    fs.unlink(`${this.rootDir}/${_id}`, (err) => {
      try {
        callback(err, { deleted: 1 });
      }
      catch(err) {
        callback(err, { deleted: 0 });
      }
    });
  }

  find(callback) {
    fs.readdir(this.rootDir, (err, listOfIds) => {
      let count = listOfIds.length;
      if(count < 1) return callback(err, []);

      const items = [];
      listOfIds.forEach(_id => {
        this.findById(_id, (err, item) => {
          count--;
          items.push(item);
          if(count === 0) callback(err, items);
        });
      });
    });
  }
}

module.exports = Store;

