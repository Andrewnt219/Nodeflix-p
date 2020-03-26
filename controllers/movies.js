const express = require('express');
const router = express.Router();
const { movie } = require('../public/js/tmdb');
const { Movie } = require('../models/movie');
const moment = require('moment');

router.get('/search', async (req, res) => {
    const mov = await movie(req.query.id);

    if (mov === 1) return res.status(404).render('movie/movie', { title: '404: Movie not found' });

    res.render('movie/movie', {
        movie: mov,
        title: mov.original_title
    })
});

router.get('/add', (req, res) => {
    const movie = {};
    movie['Action'] = true;
    res.render('movie/add');
})

router.post('/add', async (req, res, next) => {
    const {
        original_title,
        original_language,
        title,
        overview,
        stock,
        release_date,
        adult,
        video
    } = req.body;
    let { poster_img, backdrop_img } = req.files ? req.files : {};

    const movie = new Movie({
        id: Movie.idGenerator(),
        original_title: original_title,
        original_language: original_language || 'en',
        title: title,
        overview: overview,
        adult: adult || false,
        video: video || false,
        stock: stock || 15,
        release_date: release_date || Date.now()
    });

    for (const field in req.body) {
        if (String(field).match(/genre.*/))
            movie.genre.push(req.body[field]);
    }

    try {
        await movie.save();
        await Movie.updateOne({ _id: movie._id }, {
            $set: {
                poster_path: poster_img ? this.id + poster_img.name : '404.png',
                backdrop_path: backdrop_img ? this.id + backdrop_img.name : '404.png',
            }
        })
    } catch (error) {
        let errmsg = error.message;
        if (error.code === 11000)
            errmsg = 'Duplicate ID';

        let input = {...movie._doc};
        input.release_date = moment(release_date).format(moment.HTML5_FMT.DATE);

        console.log(input);

        for(genre of input.genre) {
            input[genre] = true;
        }

        return res.render('movie/add', {
            error: errmsg,
            movie: input,
        })
    }

    res.render('movie/add', { status: 'Movie is added' });
});

router.get('/edit/:movieId', (req,res) => {
    const input = Movie.findOne({id: id}).lean();

    if(!input) return res.render('utils/error');

    for(genre of input.genre) {
        input[genre] = true;
    }

    res.render('movie/edit', {movie: input});
});

router.put('/:movieId', async (req, res) => {
    const {
        original_title,
        original_language,
        title,
        overview,
        stock,
        release_date,
        adult,
        video
    } = req.body;
    let { poster_img, backdrop_img } = req.files ? req.files : {};

    const movie = await Movie.findOneAndUpdate({ id: req.params.movieId }, {
        original_title: original_title,
        original_language: original_language,
        title: title,
        overview: overview,
        stock: stock,
        release_date: release_date,
        adult: adult,
        video: video,
        poster_path: poster_img ? this.id + poster_img.name : '404.png',
        backdrop_path: backdrop_img ? this.id + backdrop_img.name : '404.png'
    }, { new: true });

    if(!movie) return res.status(400).render('utils/error', {message: 'The provided movieID does not exist'});

    res.render('movie/edit', {status: 'Movie is editted'});
});

module.exports = router;