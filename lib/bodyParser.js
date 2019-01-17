module.exports = req => {
  return new Promise((resolve, reject) => {
    
    if(req.method === 'GET') {
      return resolve();
    }

    const headers = req.headers || req.getHeaders();
    if(headers['content-type'] !== 'application/json') {
      return reject('We only support JSON');
    }

    let body = '';
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

    req.on('error', err => reject(err));
  });
};
