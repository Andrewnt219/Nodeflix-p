const fetch = require('node-fetch');



async function movie(api) {
    respond = await fetch(`https://api.themoviedb.org/3/movie/${api}?api_key=${process.env.API_KEY}&language=en-US&page=1&region=CA`);
    const {results} = await respond.json();

    respond = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.API_KEY}&language=en-US&page=1&region=CA`);
    const {genres} = await respond.json();

    results.forEach(mov => {
        mov.genres = [];
        for(genre of genres) {
            for(m_genre of mov.genre_ids) {
                if(genre.id === m_genre) mov.genres.push(genre.name);

            }
        }
        mov.genres = mov.genres.join(', ');
    })

    results.forEach(mov => mov.backdrop_path = 'http://image.tmdb.org/t/p/original' + mov.backdrop_path )
    results.forEach(mov => mov.poster_path = 'http://image.tmdb.org/t/p/original' + mov.poster_path )
    return results;
}

module.exports.movie = movie;