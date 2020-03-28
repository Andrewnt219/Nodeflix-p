const home = require('../controllers/home');
const collection = require('../controllers/collection');
const movies = require('../controllers/movies');
const users = require('../controllers/users');
const services = require('../controllers/services');

const error = require('../middleware/error');
const method = require('../middleware/method');
const loggedIn = require('../middleware/loggedIn');

module.exports = function(app) {
    app.use(method);
    app.use(loggedIn);
    
    app.use('/', home);
    app.use('/collection/', collection);
    app.use('/movies/', movies);
    app.use('/users/', users);
    app.use('/services/', services);

    app.use(error);
}