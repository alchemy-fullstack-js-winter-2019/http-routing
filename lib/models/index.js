const fs = require('fs');
const shortid = require('shortid');

class Store {
    constructor(rootDir) {
        this.rootDir = rootDir;
    }


    create(obj, callback) {
        const _id = shortid();
        const copiedObj = { ...obj, _id };
        const string = JSON.stringify(copiedObj);

        fs.writeFile(`${this.rootDir}/${_id}`, string, (err) => {
            if(err) {
                return callback(err);
            }
            callback(null, copiedObj);
        });
    }

    findById(_id, callback) {
        
        fs.readFile(`${this.rootDir}/${_id}`, (err, data) => {
            // try {
            //     const parsedJSON = JSON.parse(data);
            //     callback(err, parsedJSON);
            // } catch(e) {
            //     callback(e);
            // }
            if(err) {
                return callback(err);
            }
            const parsedJSON = JSON.parse(data);

            callback(null, parsedJSON);
        });
    }

    findByIdAndDelete(_id, callback) {
        fs.unlink(`${this.rootDir}/${_id}`, (err) => {
            if(err) {
                if(err === 'enonet') callback(null, { deleted: 0 });
                return callback(err);
            }
            callback(null, { deleted: 1 });
        });
    }

    find(callback) {
        fs.readdir(`${this.rootDir}`, (err, files) => {
            let count = files.length;
            if(count < 1) return callback(err, []);

            const items = [];
            files.forEach(_id => {
                this.findById(_id, (err, item) => {
                    count--;
                    items.push(item);
                    if(count === 0) callback(null, items);
                });
            });
        });
    }

    findByIdAndUpdate(_id, updatedObject, callback) {
        // this.findById
        this.findById(_id, err => {
            // -> is there something to update??
            if(err) return callback(err);
            // -> fs.writeFile
            const objToWrite = { ...updatedObject, _id };
            const objToWriteStr = JSON.stringify(objToWrite);
            fs.writeFile(this.storedFilePath(_id), objToWriteStr, err => {
            // -> -> invoke callback
                callback(err, objToWrite);
            });
        });
    }
    
    storedFilePath(_id) {
        return `${this.rootDir}/${_id}`;
    }
}

module.exports = Store;
