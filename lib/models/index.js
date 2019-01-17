const fs = require('fs');
const shortid = require('shortid');

module.exports = class Store {
  constructor(rootDir) {
    this.rootDir = rootDir;
  }

  create(obj, callback) {
    const _id = shortid.generate();
    const newObj = { ...obj, _id };
    try {
      const data = JSON.stringify(newObj);
      fs.writeFile(this.rootDir + '/' + `${_id}`, data, err => {
        if(err) {
          callback(err);
        }
        callback(null, newObj);
      });
    } catch(err) {
      callback(err);
    }
  }

  findById(_id, callback) {
    fs.readFile(this.rootDir + '/' + `${_id}`, { encoding: 'utf8' }, (err, data) => {
      try {
        const json = JSON.parse(data);
        callback(err, json);
      } catch(err) {
        callback(err, null);
      }
    });
  }

  findByIdAndDelete(_id, callback) {
    fs.unlink(this.rootDir + '/' + `${_id}`, (err) => {
      if(err) {
        callback(err);
      }
      else {
        callback(null, { deleted: 1 });
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
          if(count === 0) return callback(null, items);
        });
      });
    });
  }

  findByIdAndUpdate(_id, updatedObject, callback) {
    this.findById(_id, err => {
      if(err) return callback(err);
      const objToWrite = { ...updatedObject, _id };
      const objToWriteString = JSON.stringify(objToWrite);
      fs.writeFile(`${this.rootDir}/${_id}`, objToWriteString, err => {
        callback(err, objToWrite);
      });
    });
  }

};
