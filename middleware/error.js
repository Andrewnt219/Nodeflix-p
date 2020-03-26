const wiston = require('winston');

module.exports = function(err,req,res,next) {
    console.log('error.js--' + err);
    res.status(500).render('utils/error', {title: 'Sorry'});
}