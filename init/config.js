const express = require('express');
const exphbs = require('express-handlebars');
require('dotenv').config({ path: './config/.env' });

module.exports = function (app) {
    app.use(express.json());
    app.use(express.static('public'));

    app.listen(process.env.PORT, () => console.log('Ready for renting'));
    app.engine('handlebars', exphbs());
    app.set('view engine', 'handlebars');
}