const jwt = require('jsonwebtoken');

module.exports = function(req,res, next) {
    res.locals.loggedIn = req.signedCookies.token ? true : false;
    res.locals.isAdmin = req.cookies.status === 'admin';
    next();
}