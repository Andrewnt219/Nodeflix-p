const wiston = require('winston');

module.exports = function(err,req,res,next) {
    wiston.error(err);
    res.status(500).send('Route exception: ' + err);
}