const home = require('../controllers/home');
const movies = require('../controllers/movies');

module.exports = function(app) {
    app.use('/', home);
    app.use('/movies/', movies);
}