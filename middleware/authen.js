const jwt = require('jsonwebtoken');

module.exports = function(req,res,next) {
    const token = req.signedCookies.token;
    if(!token) return res.status(401).render('user/user', {title: '401: Not logged in'});

    jwt.verify(token, process.env.jwtPrivateKey, function(err, decoded) {
        if(err) return res.status(400).render('utils/error', {message: 'author.js--Begone hackers!'});

        if(!decoded.isAdmin) return res.status(403).render('user/user', {title: '403: Forbidden'});

        req.user = decoded;

        next();
    });
}