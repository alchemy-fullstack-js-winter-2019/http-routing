const shortid = require('shortid');
const fs = require('fs');

class Store {
  constructor(rootDir) {
    this.rootDir = rootDir;
    this.shortid = shortid;
  }
  create(obj, callback) {
    const _id = shortid.generate();
    const object = { ... obj, _id };
    const strObject = JSON.stringify(object);

    fs.writeFile(`${this.rootDir}/${_id}`, strObject, err => {
      
      return callback(err, object); 

    });
  }
  findById(_id, callback) {
    fs.readFile(`${this.rootDir}/${_id}`, (err, data) => {
      try {
        const foundItem = JSON.parse(data);
        return callback(err, foundItem);
      }
      catch(e) {
        callback(e);
      }
    });
  }
  findByIdAndDelete(_id, callback) {
    fs.unlink(`${this.rootDir}/${_id}`, err => {
      if(err) {
        return callback(err);
      }
      callback(null, { deleted: 1 });
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
    }
    );}
}

module.exports = { 
  
  Store 

};