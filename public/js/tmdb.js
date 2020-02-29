const fetch = require('node-fetch');


async function getAllGenres() {
    const respond = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.API_KEY}&language=en-US&page=1&region=CA`);
    return respond.json();
}

async function getGenreId(genreName) {
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

async function populateMovie(movie) {
    movie.genre = [];
    for (genre of movie.genres) {
        movie.genre.push(genre.name);
    }
    movie.genre = movie.genre.join(', ');

    movie.backdrop_path = 'http://image.tmdb.org/t/p/original' + movie.backdrop_path;
    movie.poster_path = 'http://image.tmdb.org/t/p/original' + movie.poster_path;
    return movie;
}

async function movies(api) {
    const respond = await fetch(`https://api.themoviedb.org/3/movie/${api}?api_key=${process.env.API_KEY}&language=en-US&page=1&region=CA`);
    const { results } = await respond.json();

    return populateMovies(results);
}

async function movie(movieId) {
    const respond = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.API_KEY}&language=en-US`);
    const movie  = await respond.json();

    return populateMovie(movie);
}

async function discoverGenre(genre) {
    const genreId = await getGenreId(genre);
    let respond = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=8c38f8d7ffa0be110074225859ed94c1&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=${genreId}`);

    const { results } = await respond.json();
    return populateMovies(results);

}

module.exports.movies = movies;
module.exports.movie = movie;
module.exports.discoverGenre = discoverGenre;