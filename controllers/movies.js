const express = require('express');
const router = express.Router();
const { movie } = require('../public/js/tmdb');

router.get('/:movieId', async (req,res) => {
    const mov = await movie(req.params.movieId);
    
    if(mov === 1) return res.status(404).render('movie/movie', {title:'404: Movie not found'});

    res.render('movie/movie', {
        movie: mov,
        title: mov.original_title
    })
})

module.exports = router;