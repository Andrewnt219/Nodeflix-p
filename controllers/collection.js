const express = require('express');
const router = express.Router();
const { sentenceCase } = require('change-case');
const moment = require('moment');

const { Movie } = require('../models/movie');


const imgPath = '/img/';
function formatMovies(movies) {
    movies.forEach(m => {
        m.ref = `/movies/search?id=${m.id}`;
        m.release_date = moment(m.release_date).format(moment.HTML5_FMT.DATE);
        m.genre = m.genre.join(', ');
        if (!m.poster_path.includes('http'))
            m.poster_path = imgPath + m.poster_path;
        if (!m.backdrop_path.includes('http'))
            m.backdrop_path = imgPath + m.backdrop_path;
        if(m.price == 0)
            m.price = 'N/A';
    })
    return movies;
}

router.get('/', async (req, res) => {
    if (!req.query.sortBy)
        req.query.sortBy = 'now_playing';

    if (!req.cookies.popup)
        res.cookie('popup', '1');
    const show = req.cookies.popup != '1'

    let movies = [];
    if(req.query.sortBy === 'best_seller') 
        movies = formatMovies(await Movie.find({ best_seller: true}).sort('title').lean());
    else
        movies = formatMovies(await Movie.find({ category: req.query.sortBy }).sort('title').lean());

    res.render('movie/movies', {
        movies: movies,
        title: sentenceCase(req.query.sortBy),
        popup: show
    });
})

router.post('/', async (req, res) => {
    res.render('movie/movies', {
        movies: formatMovies(await Movie.find({ title: new RegExp(req.body.movie, 'i') }).sort('title').lean()),
        title: req.body.movie
    })
})

router.get('/:genreName', async (req, res) => {
    const findGenre = decodeURIComponent(req.params.genreName);
    res.render('movie/movies', {
        movies: formatMovies(await Movie.find({ genre: findGenre }).sort('title').lean()),
        title: findGenre,
    })
})

module.exports = router;