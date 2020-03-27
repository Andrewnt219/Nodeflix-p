const fetch = require('node-fetch');

async function getAllGenres() {
    const respond = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.API_KEY}&language=en-US&page=1&region=CA`);
    return respond.json();
}

async function getGenreId(genreName) {
    const { genres } = await getAllGenres();
    if(genres.length === 0) return 1;
    for (genre of genres) {
        if (genre.name.toLowerCase() === genreName.toLowerCase()) {
            return genre.id;
        }

    }
}

async function populateMovies(movies) {
    const { genres } = await getAllGenres();
    if (!movies || genres.length === 0 ) return 1;
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

    movies.forEach(mov => {
        mov.ref = `/movies/search?id=${mov.id}`;
        mov.backdrop_path? mov.backdrop_path = 'http://image.tmdb.org/t/p/original' + mov.backdrop_path : mov.backdrop_path = '/img/404.png';
        mov.poster_path? mov.poster_path = 'http://image.tmdb.org/t/p/original' + mov.poster_path : mov.poster_path = '/img/404.png';
        mov.vote_average = mov.vote_average.toFixed(1);
        mov.popularity = Number(String(mov.popularity).replace('.',''));
    });
    return movies;
}

async function populateMovie(movie) {
    if(!movie.genres) return 1;
    movie.genre = [];
    for (genre of movie.genres) {
        movie.genre.push(genre.name);
    }
    movie.genre = movie.genre.join(', ');

    movie.popularity = Number(String(movie.popularity).replace('.',''));

    movie.backdrop_path? movie.backdrop_path = 'http://image.tmdb.org/t/p/original' + movie.backdrop_path : movie.backdrop_path = '/img/404.png';
    movie.poster_path? movie.poster_path = 'http://image.tmdb.org/t/p/original' + movie.poster_path : movie.poster_path = '/img/404.png';

    movie.vote_average = movie.vote_average.toFixed(1);

    movie.price = (Math.round(Math.random() * (15 - 4 + 1) + 4) + 0.99).toFixed(2);
    movie.rent = Math.ceil(movie.price * .2);
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
    let respond = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=${genreId}`);

    const { results } = await respond.json();
    return populateMovies(results);

}


async function searchMovie(keyword) {
    movieName = keyword.replace(' ','+');
    const respond = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY}&query=${movieName}`);
    const {results} = await respond.json();
    return populateMovies(results); 
}
module.exports.movies = movies;
module.exports.movie = movie;
module.exports.discoverGenre = discoverGenre;
module.exports.searchMovie = searchMovie;