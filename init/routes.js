const home = require('../controllers/home');
const genres = require('../controllers/genres');
const movies = require('../controllers/movies');
const users = require('../controllers/users');
const error = require('../middleware/error');

module.exports = function(app) {
    app.use('/', home);
    app.use('/genres/', genres);
    app.use('/movies/', movies);
    app.use('/users/', users);

    app.use(error);
}