const express = require('express');
const router = express.Router();
const { sentenceCase } = require('change-case');

const { movie, discoverGenre } = require('../public/js/tmdb');

router.get('/:option', async (req, res) => {
    res.render('home/home', {
        movies: await movie(req.params.option),
        title: sentenceCase(req.params.option),
    })
})

router.get('/genres/:genreName', async (req, res) => {
    const genre = decodeURIComponent(req.params.genreName);
    res.render('home/home', {
        movies: await discoverGenre(genre),
        title: genre,
    })
})


module.exports = router;