const express = require('express');
const router = express.Router();
const { sentenceCase } = require('change-case');

const { movies, discoverGenre, movie } = require('../public/js/tmdb');

router.get('/', async (req, res) => {
    res.render('movie/movies', {
        movies: await movies(req.query.sortBy),
        title: sentenceCase(req.query.sortBy),
    })
})

router.get('/:movieId', async (req,res) => {
    const mov = await movie(req.params.movieId);
    res.render('movie/movie', {
        movie: mov,
        title: mov.original_title 
    })
})

router.get('/genres/:genreName', async (req, res) => {
    const genre = decodeURIComponent(req.params.genreName);
    res.render('movie/movies', {
        movies: await discoverGenre(genre),
        title: genre,
    })
})


module.exports = router;