module.exports = (req, end) => {
  let data = '';
  if(req.method === 'POST') {
    req.on('data', chunk => data += chunk);
    req.on('end', () => end(data));
  }
  end(data);
};
