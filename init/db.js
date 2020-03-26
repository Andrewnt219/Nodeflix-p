const mongoose = require('mongoose');
require('dotenv').config({ path: '../config/.env' });
const winston = require('winston');

module.exports = function () {
    mongoose.connect(process.env.db, { useNewUrlParser: true, useUnifiedTopology: true, autoIndex: true, useCreateIndex: true, useFindAndModify:false })
        .then(() => console.log('Connecting to ' + process.env.db))
        .catch((ex => console.log(ex)));
}