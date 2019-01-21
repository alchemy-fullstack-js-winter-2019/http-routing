module.exports = (req, end) => {
  let data = '';
  if(req.method === 'POST' || req.method === 'PUT') {
    req.on('data', chunk => data += chunk);
    req.on('end', () => end(JSON.parse(data)));
  }
  else {
    end();
  }
};
