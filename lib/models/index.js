const shortid = require('shortid');
const fs = require('fs');

class Store {
  constructor(rootDir) {
    this.rootDir = rootDir;
  }
  create(obj, callback) {
    const _id = shortid.generate();
    const copyObj = { ...obj, _id };
    const data = JSON.stringify(copyObj);
    fs.writeFile(`${this.rootDir}/${_id}`, data, err => {
      callback(err, copyObj);
    });
  }

  findById(_id, callback) {
    fs.readFile(`${this.rootDir}/${_id}`, { encoding: 'utf8' }, (err, data) => {
      try {
        const json = JSON.parse(data);
        callback(err, json);
      } catch(e) {
        callback(e);
      }
    });
  }

  findByIdAndDelete(_id, callback) {
    fs.unlink(`${this.rootDir}/${_id}`, error => {
      if(error) {
        callback(error);
      } else {
        callback(null, { deleted: 1 });
      }
    });
  }

  findByIdAndUpdate(_id, objToUpdate, callback) {
    this.findById(_id, (err) => {
      if(err) return callback(err);
      const objToWrite = { ...objToUpdate, _id };
      const objToWriteString = JSON.stringify(objToWrite);
      fs.writeFile(`${this.rootDir}/${_id}`, objToWriteString, err => {
        callback(err, objToWrite);
      });
    });
  }

  find(callback) {
    fs.readdir(this.rootDir, (err, listOfIds) => {
      let count = listOfIds.length;
      if(count < 1) callback(err, []);
      const items = [];
      listOfIds.forEach(_id => {
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