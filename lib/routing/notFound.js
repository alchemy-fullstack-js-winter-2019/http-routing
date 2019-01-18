
module.exports = (req, res) => {
    res.end(JSON.stringify({ error: 'Not Found' }));
    res.statusCode = 404;
};
