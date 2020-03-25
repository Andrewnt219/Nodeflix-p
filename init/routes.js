const home = require('../controllers/home');
const genres = require('../controllers/genres');
const movies = require('../controllers/movies');
const users = require('../controllers/users');

module.exports = function(app) {
    app.use('/', home);
    app.use('/genres/', genres);
    app.use('/movies/', movies);
    app.use('/users/', users);
}