const home = require('../controllers/home');
const collection = require('../controllers/collection');
const movies = require('../controllers/movies');
const users = require('../controllers/users');
const error = require('../middleware/error');
const method = require('../middleware/method');

module.exports = function(app) {
    app.use(method);
    
    app.use('/', home);
    app.use('/collection/', collection);
    app.use('/movies/', movies);
    app.use('/users/', users);

    app.use(error);
}