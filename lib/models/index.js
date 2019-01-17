const shortid = require('shortid');
const fs = require('fs');

class Store {
  constructor(rootDir) {
    this.rootDir = rootDir;
    
  }

  create(obj, callback) {
  
    
    const _id = shortid.generate();
    const objWithId = { ...obj, _id };
    const objWithIdStr = JSON.stringify(objWithId);
  
    fs.writeFile(`${this.rootDir}/${_id}`, objWithIdStr, err => {
      if(err) return callback(err);
      callback(null, objWithId);
    });

  }

  findById(_id, callback) {
    
    fs.readFile(`${this.rootDir}/${_id}`, { encoding: 'utf8' }, (err, data) => {
      try {
        const parsedJSON = JSON.parse(data);
        callback(err, parsedJSON);
      } catch(e) {
        callback(e);
      }
    
    });
  
  }

  findByIdAndDelete(_id, callback) {
    fs.unlink(`${this.rootDir}/${_id}`, (err) => {
      if(err) {
        return callback(err);
      }
      callback(null, { deleted: 1 });
    });
  }

  find(callback) {
    //fs.readdir list of files in directory
    // for each file we can call findById
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
  // eslint-disable-next-line no-unused-vars
  storedFilePath(_id) {
    // eslint-disable-next-line no-undef
    return `${this.rootDir}/${id}`;
  }

}

module.exports = Store;