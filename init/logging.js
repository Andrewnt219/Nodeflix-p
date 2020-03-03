const winston = require('winston');
require('express-async-errors');

module.exports = function() {
    winston.add(new winston.transports.File({
        filename: 'log.log',
        handleExceptions: true,
        format: winston.format.combine(winston.format.colorize())
    }));
    winston.add(new winston.transports.Console({
        handleExceptions: true,
        format: winston.format.combine(winston.format.colorize()),
        level: 'error'
    }));

    // winston catches this
    process.on('unhandledRejection', ex => {
        throw ex;
    })
}
