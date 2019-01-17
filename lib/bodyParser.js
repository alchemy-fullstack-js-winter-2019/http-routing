// module.exports = req => {
//   return new Promise((resolve, reject) => {
//     let body = '';
//     req.on('data', chunk => {
//       body += chunk;
//     });
//     req.on('end', () => {
//       resolve(JSON.parse(body)); // parse the body and send back
//     });
//     req.on('error', err => reject(err));
//   });
// };

module.exports = req => {
  return new Promise((resolve, reject) => {
    // if method GET resolve with empty body
    if(req.method === 'GET') {
      return resolve();
    }
    // if not JSON reject with error
    const headers = req.headers || req.getHeaders();
    if(headers['content-type'] !== 'application/json') {
      return reject('Error: only JSON supported');
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
    req.on('error', err => {
      reject(err);
    });
  });
};
