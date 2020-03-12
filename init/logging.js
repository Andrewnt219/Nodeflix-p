const winston = require('winston');
require('express-async-errors');

module.exports = function() {
    // winston catches this
    process.on('unhandledRejection', ex => {
        throw ex;
    })
}
