module.exports = request => {

    return new Promise((resolve, reject) => {
        
        if(request.method === 'GET') {
            return resolve();
        }
        const headers = request.headers || request.getHeaders();
        if(headers['content-type'] !== 'application/json') {
            return reject('We only support JSON');
        }

        let body = '';
        request.on('data', chunk => {
            body += chunk;
        });
        request.on('end', () => {
            let json = null;
            try {
                json = JSON.parse(body);
            } catch(e) {
                return reject(e);
            } 
            resolve(json);
        });
        request.on('error', (err) => {
            reject(err);
        });
    });
};



