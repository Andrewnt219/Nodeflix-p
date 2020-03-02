const jwt = require('jsonwebtoken');

module.exports = function(req,res,next) {
    const token = req.cookies.token;
    if(!token) res.status(401).send('Not logged in');
    
    try {
        const decoded = jwt.verify(token, process.env.jwtPrivateKey);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).send('Cannot authorized user: ' + ex);
    }
}