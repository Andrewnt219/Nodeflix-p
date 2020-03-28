const express = require('express');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
require('dotenv').config({ path: './config/.env' });
require('express-async-errors');

module.exports = function (app) {
    const hbs = exphbs.create({
      helpers: {
        checked: function(obj, prop) {
            
            if(obj && obj[prop]) return 'checked';
        }
      }
    });
    app.use(fileUpload({
        preserveExtension: true
      }));
    app.use(express.json());
    app.use(express.urlencoded({extended:true}));
    app.use(express.static('public'));
    app.use(cookieParser(process.env.secretCookie));

    app.listen(process.env.PORT, () => console.log('Ready for renting'));
    app.engine('handlebars', hbs.engine);
    app.set('view engine', 'handlebars');
}