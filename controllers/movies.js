const express = require('express');
const router = express.Router();

const { movie } = require('../public/js/tmdb');

router.get('/top-rated', async (req, res) => {
    res.render('home/home', {
        movies: await movie('top_rated'),
        title: 'Top Rated',
        isTop: true
    }
    )
})

router.get('/upcoming', async (req, res) => {
    res.render('home/home', {
        movies: await movie('upcoming'),
        title: 'Upcoming',
        isComming: true
    }
    )
})

router.get('/popular', async (req, res) => {
    res.render('home/home', {
        movies: await movie('popular'),
        title: 'Popular',
        isPopular: true
    }
    )
})

router.get('/Action', async (req, res) => {

})

router.get('/Adventure', async (req, res) => {

})

router.get('/Comedy', async (req, res) => {

})

router.get('/Romance', async (req, res) => {

})

router.get('/Sci-fi', async (req, res) => {

})

module.exports = router;