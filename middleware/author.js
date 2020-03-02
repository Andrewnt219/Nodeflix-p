const jwt = require('jsonwebtoken');

module.exports = function(req,res,next) {
    const token = req.cookies.token;
    if(!token) return res.status(401).render('user/user', {title: '401: Not logged in'});
    
    try {
        const decoded = jwt.verify(token, process.env.jwtPrivateKey);
        console.log(decoded);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).send('Cannot authorized user: ' + ex);
    }
}