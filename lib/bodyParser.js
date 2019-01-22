/* eslint-disable no-console */
module.exports = req => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      resolve(JSON.parse(body));
    });

    req.on('error', () => {
      let json = null;
      try {
        json = JSON.parse(body);
      } catch(e) {
        return reject(e);
      }

      resolve(json);
    });

    // check that content type is json
    const headers = req.headers || req.getHeaders();
    if(headers['content-type'] !== 'application/json') {
      return reject('We only support json');
    }


    // check if method is GET
    if(req.method === 'GET') {
      return resolve();
    }

  });

};
