
const fs = require('fs');
const shortid = require('shortid');

class Store {
  constructor(rootDir) {
    this.rootDir = rootDir;
  }

  create(obj, callback) {
    const _id = shortid.generate();
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
        // console.log('Do you have an', _id);
        callback(err, obj);
      } catch(err) {
        callback(err);
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
          if(count === 0) callback(null, items);
        });
      });
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

  //Find by ID and Update
  findByIdAndUpdate(_id, updatedObject, callback) {
    this.findById(_id, (err => {
      if(err) return callback(err);
      const objToWrite = { ...updatedObject, _id };
      const objToWriteStr = JSON.stringify(objToWrite);
      fs.writeFile(this.storedFilePath(_id), objToWriteStr, err => {
        callback(err, objToWrite);

      });
    }));
  }

  storedFilePath(_id) {
    return `${this.rootDir}/${_id}`;
  }
}

module.exports = Store;
