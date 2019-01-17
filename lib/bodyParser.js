module.exports = req => {
  return new Promise((resolve, reject) => {
    
    if(req.method === 'GET') return resolve();

    // if(req.getHeader('Content-Type') !== 'application/json') reject('we only support json');

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

    req.on('error', err => {
      reject(err);
    });
  });
};
