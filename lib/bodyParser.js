module.exports = req => {
  return new Promise((resolve, reject) => {
    let body = '';
      
    const type = req.headers['content-type'];
  
    if(req.method === 'GET') {
      return resolve();
    }
  
    if(type !== 'application/json') {
      return reject('We only support JSON');
    }
  
    req.on('data', chunk => {
      body += chunk;
    });
  
    req.on('end', () => {
      let json = null;
  
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
