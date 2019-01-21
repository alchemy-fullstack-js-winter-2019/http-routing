module.exports = (req, end) => {
  let data = '';
  if(req.method !== 'GET') {
    req.on('data', chunk => data += chunk);
    req.on('end', () => end(JSON.parse(data)));
  }
  else {
    end();
  }
};
