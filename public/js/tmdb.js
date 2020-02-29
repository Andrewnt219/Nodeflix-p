const fetch = require('node-fetch');


module.exports.getAllGenres = async function() {
    const respond = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.API_KEY}&language=en-US&page=1&region=CA`);
    return respond.json();
}

module.exports.getGenreId = async function (genreName) {
    const { genres } = await getAllGenres();
    for (genre of genres) {
        if (genre.name.toLowerCase() === genreName.toLowerCase()) {
            return genre.id;
        }

    }
}

async function populateMovies(movies) {
    const { genres } = await getAllGenres();
    movies.forEach(mov => {
        mov.genres = [];
        for (m_genre of mov.genre_ids) {
            for (genre of genres) {
                if (m_genre === genre.id)
                    mov.genres.push(genre.name);
            }
        }
        mov.genres = mov.genres.join(', ');
    })

    movies.forEach(mov => mov.backdrop_path = 'http://image.tmdb.org/t/p/original' + mov.backdrop_path)
    movies.forEach(mov => mov.poster_path = 'http://image.tmdb.org/t/p/original' + mov.poster_path)
    return movies;
}

module.exports.populateMovie = async function(mov) {
    const { genres } = await getAllGenres();
    mov.genres = [];
    for (m_genre of mov.genre_ids) {
        for (genre of genres) {
            if (m_genre === genre.id)
                mov.genres.push(genre.name);
        }
    }
    mov.genres = mov.genres.join(', ');
    return mov;
}

module.exports.movie = async function(api) {
    const respond = await fetch(`https://api.themoviedb.org/3/movie/${api}?api_key=${process.env.API_KEY}&language=en-US&page=1&region=CA`);
    const { results } = await respond.json();

    return populateMovies(results);
}

module.exports.discoverGenre = async function(genre) {
    const genreId = await getGenreId(genre);
    let respond = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=8c38f8d7ffa0be110074225859ed94c1&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=${genreId}`);

    const { results } = await respond.json();
    return populateMovies(results);

}