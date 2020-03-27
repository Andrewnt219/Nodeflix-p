const express = require('express');
const router = express.Router();
const { sentenceCase } = require('change-case');

const { movies, discoverGenre, movie, searchMovie } = require('../public/js/tmdb');
const { Movie } = require('../models/movie');


router.get('/', async (req, res) => {
    if (!req.query.sortBy)
        req.query.sortBy = 'now_playing';

    if (!req.cookies.popup)
        res.cookie('popup', '1');
    const show = req.cookies.popup != '1'

    res.render('movie/movies', {
        movies: await Movie.find({ category: req.query.sortBy }).lean(),
        title: sentenceCase(req.query.sortBy),
        popup: show
    });
})

router.post('/', async (req, res) => {
    res.render('movie/movies', {
        movies: await Movie.find({title: new RegExp(req.body.movie, 'i')}).lean(),
        title: req.body.movie
    })
})

router.get('/:genreName', async (req, res) => {
    const findGenre = decodeURIComponent(req.params.genreName);
    res.render('movie/movies', {
        movies: await Movie.find({ genre: findGenre }).lean(),
        title: findGenre,
    })
})

module.exports = router;