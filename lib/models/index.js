const shortid = require('shortid');
const fs = require('fs');


class Store {
  constructor(rootDir) {
    this.rootDir = rootDir;
  }

  create(obj, callback) {
    // create _id and put it into obj
    const _id = shortid.generate();
    const newObj = { ...obj, _id };
    // JSON.stringify my obj with id
    const objString = JSON.stringify(newObj);
    // fs.writeFile to save object on disk
    //    this.rootDir + / ${_id}.json
    const path = `${this.rootDir}/${_id}`;
    fs.writeFile(path, objString, err => {
      if(err) return callback(err);
      callback(err, newObj);
    // invoke callback(err, obj with id)
    });
  } 
  
  findById(_id, callback) {
    // readJSON
    // fs.readFile to read the this.rootDir
    fs.readFile(`${this.rootDir}/${_id}`, (err, data) => {
      // JSON.parse to turn string into object
      // callback(err, parsedJSON)
      if(err) return callback(err);
      const parsedJSON = JSON.parse(data);
      callback(err, parsedJSON);
      
    });
  }

  find(callback) {
    // fs.readdir list of files in directory
    // for each file we can call findById
    // keep a count of returned callbacks
    fs.readdir(this.rootDir, (err, listOfIds) => {
      // keep a count of no. of item findBy Id has returned
      let count = listOfIds.length;
      if(count < 1) return callback(err, []);
      const items = [];
      listOfIds.forEach(_id => {
        this.findById(_id, (err, item) => {
          // decrement count
          count--;
          // push the item to item
          items.push(item);
          // if count === 0 return callback(null, items)
          if(count === 0) callback(null, items);
        });
      });
    });
  }

  findByIdAndDelete(_id, callback) {
    fs.unlink(this.storedFilePath(_id), err => {
      callback(err, { deleted: 1 });
    });
  }

  findByIdAndUpdate(_id, updatedObject, callback) {
    // this.findById
    this.findById(_id, err => {
      // is there something to update??
      if(err) return callback(err);
      // fs.writeFile
      const objToWrite = { ...updatedObject, _id };
      const objToWriteStr = JSON.stringify(objToWrite);
      fs.writeFile(`${this.rootDir}/${_id}`, objToWriteStr,  err => {
        // invoke callback
        callback(err, objToWrite);
      });
    });
  }

  storedFilePath(_id) {
    return `${this.rootDir}/${_id}`;
  }
}
  
module.exports = Store;
 
