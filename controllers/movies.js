const express = require('express');
const router = express.Router();
const { movies, discoverGenre, movie, searchMovie } = require('../public/js/tmdb');
const { Movie } = require('../models/movie');
const moment = require('moment');

const authen = require('../middleware/authen');

const imgPath = '/img/';
function formatMovie(movie) {
    if (movie) {
        movie.ref = `/movies/search?id=${movie.id}`;
        movie.release_date = moment(movie.release_date).format(moment.HTML5_FMT.DATE);
        movie.genre = movie.genre.join(', ');
        if (!movie.poster_path.includes('http'))
            movie.poster_path = imgPath + movie.poster_path;
        if (!movie.backdrop_path.includes('http'))
            movie.backdrop_path = imgPath + movie.backdrop_path;
        if(movie.price == 0)
            movie.price = 'N/A';
    }

    return movie;
}

router.get('/search', async (req, res) => {
    let mov = {};
    if (req.query.id)
        mov = formatMovie(await Movie.findOne({ id: req.query.id }).lean());
    else if (req.query.title) {
        tokens = req.query.title.split(', ');
        mov = formatMovie(await Movie.findOne({ id: tokens[0] }).lean())
    }


    if (!mov) return res.status(404).render('movie/movie', { title: '404: Movie not found' });

    res.render('movie/movie', {
        movie: mov,
        title: mov.title
    })
});

router.use(authen);
/**
 * Dashboard
 */
router.get('/', async (req, res) => {
    const movies = await Movie.find()
        .select('id title price stock poster_path')
        .sort('title')
        .lean();
    movies.forEach(movie => {
        if (!movie.poster_path.includes('http'))
            movie.poster_path = imgPath + movie.poster_path;
    });

    res.render('movie/dashboard', {
        movies: movies,
        title: 'Dashboard'
    })
})
/**
 * Populate database
 */
router.get('/pull', async (req, res) => {
    const now_playing = await movies('now_playing');
    const popular = await movies('popular');
    const top_rated = await movies('top_rated');
    const upcoming = await movies('upcoming');
    const action = await discoverGenre('Action');
    const adventure = await discoverGenre('Adventure');
    const romance = await discoverGenre('Romance');
    const comedy = await discoverGenre('Comedy');
    const sci_fi = await discoverGenre('Science Fiction');
    let collection = [...now_playing, ...popular, ...upcoming, ...top_rated, ...action, ...adventure, ...romance, ...comedy, ...sci_fi];

    const seen = new Set();
    collection = collection.filter(movie => {
        const duplicate = seen.has(movie.id);
        seen.add(movie.id);
        return !duplicate;
    });

    collection.forEach(async movie => {
        movie.genres = movie.genres.split(', ');
        const pulledMovie = new Movie({
            popularity: movie.popularity,
            vote_count: movie.vote_count,
            poster_path: movie.poster_path,
            id: movie.id,
            backdrop_path: movie.backdrop_path,
            original_language: movie.original_language,
            genre: movie.genres,
            title: movie.title,
            vote_average: movie.vote_average,
            release_date: movie.release_date,
            overview: movie.overview
        })

        try {
            await pulledMovie.save();
        } catch (error) {
            console.log('Pulling error--' + error);
        }
    })
    res.redirect('/movies');
})

/**
 * Add movie
 */
router.get('/add', (req, res) => {
    res.render('movie/add', {title: 'Add'});
})

router.post('/add', async (req, res, next) => {
    const {
        original_title,
        original_language,
        title,
        overview,
        stock,
        release_date
    } = req.body;
    let { poster_img, backdrop_img } = req.files ? req.files : {};

    let movie = new Movie({
        id: Movie.idGenerator(),
        original_title: original_title,
        original_language: original_language || 'en',
        title: title,
        overview: overview,
        stock: stock || 15,
        release_date: release_date || Date.now()
    });

    for (const field in req.body) {
        if (String(field).match(/genre.*/))
            movie.genre.push(req.body[field]);
    }

    try {
        movie = await movie.save();

        if (poster_img) {
            poster_img.name = 'poster_' + movie._id + poster_img.name;
            await poster_img.mv(`public/img/${poster_img.name}`);
        }
        if (backdrop_img) {
            backdrop_img.name = 'backdrop_' + movie._id + backdrop_img.name;
            await backdrop_img.mv(`public/img/${backdrop_img.name}`);
        }

        await Movie.findOneAndUpdate({ _id: movie._id }, {
            $set: {
                poster_path: (poster_img ? poster_img.name : '404.png'),
                backdrop_path: (backdrop_img ? backdrop_img.name : '404.png'),
            }
        }, {runValidators: true})
        
        res.redirect(`/movies/search?id=${movie.id}`);

    } catch (error) {
        let errmsg = error.message;

        let input = { ...movie._doc };
        input.release_date = moment(release_date).format(moment.HTML5_FMT.DATE);

        for (genre of input.genre) {
            input[genre] = true;
        }

        return res.render('movie/add', {
            title: 'Add',
            error: errmsg,
            movie: input,
        })
    }
});

/**
 * edit movie
 */
router.get('/edit/:movieId', async (req, res) => {
    const input = await Movie.findOne({ id: req.params.movieId }).lean();

    if (!input) return res.render('utils/error');

    input.release_date = moment(input.release_date).format(moment.HTML5_FMT.DATE);
    for (genre of input.genre) {
        input[genre] = true;
    }

    res.render('movie/edit', { movie: input, title: 'Edit' });
});

router.put('/edit/', async (req, res) => {
    const {
        _id,
        original_title,
        original_language,
        title,
        overview,
        stock,
        release_date,
    } = req.body;
    let { poster_img, backdrop_img } = req.files ? req.files : {};
    let genres = [];

    for (field in req.body) {
        if (field.match(/genre.*/))
            genres.push(req.body[field]);
    }

    try {
        const movie = await Movie.findOneAndUpdate({ _id: _id }, {
            original_title: original_title,
            original_language: original_language,
            title: title,
            overview: overview,
            stock: stock || 15,
            release_date: release_date,
            genre: genres
        }, { runValidators: true, new: true });

        if (poster_img) {
            poster_img.name = 'poster_' + _id + poster_img.name;
            await poster_img.mv(`public/img/${poster_img.name}`);
            await Movie.findOneAndUpdate({_id: _id}, {
                poster_path: poster_img.name
            }, {new: true, runValidators: true});
        }
        res.redirect(`/movies/search?id=${movie.id}`);

    } catch (error) {
        let errmsg = error.message;

        let input = { ...req.body };
        input.genre = [...genres];
        input.release_date = moment(release_date).format(moment.HTML5_FMT.DATE);

        for (genre of input.genre) {
            input[genre] = true;
        }

        return res.render('movie/edit', {
            error: errmsg,
            movie: input,
        })
    }
});

/**
 * Delete movie
 */
router.delete('/delete/:movieId', async (req, res) => {
    const movie = await Movie.findOneAndDelete({ id: req.params.movieId });

    if (!movie) return res.render('utils/error', { message: 'Movie not found' });

    res.redirect(req.headers.referer);

})

module.exports = router;