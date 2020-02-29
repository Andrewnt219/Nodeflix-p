const express = require('express');
const router = express.Router();
const utils = require('../public/js/tmdb')

router.get('/', async (req,res) => {
    res.render('home/home', {
        movies: await utils.movie('now_playing'),
        title: 'New Releases',
        isNew: true
    });
})

module.exports = router;