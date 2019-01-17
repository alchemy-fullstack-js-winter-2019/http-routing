module.exports = req => {
  return new Promise((resolve, reject) => {
    if(req.method === 'GET') {
      return resolve();
    }
    const headers = req.headers || req.getHeaders();
    if(headers['content-type'] !== 'application/json') {
      return reject('we only support JSON');
    }
    
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => {
      //this let json is for the resolve() to offset(no red squiggles)
      let json = null;
      //json has to be in a try block so that the input can be parsed into json, otherwise it will blow up
      try {
        json = JSON.parse(body);
      } catch(e) {
        return reject(e);
      }
      resolve(json);
    });
    req.on('error', err => {
      reject(err);
    });
  });
};
