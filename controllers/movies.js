const express = require('express');
const router = express.Router();
const { movie } = require('../public/js/tmdb');
const {Movie} = require('../models/movie');
const moment = require('moment');

router.get('/search', async (req,res) => {
    const mov = await movie(req.query.id);
    
    if(mov === 1) return res.status(404).render('movie/movie', {title:'404: Movie not found'});

    res.render('movie/movie', {
        movie: mov,
        title: mov.original_title
    })
});

router.get('/add', (req,res) => {
    res.render('movie/add');
})

router.post('/add', (req,res,next) => {
    const {
        original_title,
        title,
        overview,
        id,
        stock
    } = req.body;
    let {release_date} = req.body;
    const {poster_path, backdrop_path} = req.files? req.files : {};
    release_date = moment(release_date).format(moment.HTML5_FMT.DATE);
    const movie = new Movie({
        original_title: original_title,
        title: title,
        overview: overview,
        id: id,
        poster_path: poster_path? poster_path.name : '',
        backdrop_path: backdrop_path? backdrop_path.name: '',
        stock: stock,
        release_date: release_date
    });

    for(const field in req.body) {
        if(String(field).match(/genre.*/))
            movie.genre.push(req.body[field]);
    }

    movie.save()
        .then(() => res.render('movie/add', {status: 'Movie is added'}))
        .catch((err) =>  {
            let errmsg = err.message;
            if (err.code === 11000)
                errmsg = 'Duplicate ID'
            return res.render('movie/add', {
                error: errmsg,
                original_title: original_title,
                title: title,
                overview: overview,
                id: id,
                stock: stock,
                release_date: release_date
            })
        });
});

module.exports = router;