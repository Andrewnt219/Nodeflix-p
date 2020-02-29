const fetch = require('node-fetch');


async function getAllGenres() {
    const respond = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.API_KEY}&language=en-US&page=1&region=CA`);
    return respond.json(); 
}
async function lookupGenre(genreId) {
    const {genres} = await getAllGenres();
    for (genre of genres) {
        if(genre.id === genreId) {
            return genre.name;
        }

    }
}

async function movie(api, ...queries) {
    const queryString = queries.length > 0? '&'+queries.join('&'):'';
    respond = await fetch(`https://api.themoviedb.org/3/movie/${api}?api_key=${process.env.API_KEY}&language=en-US&page=1&region=CA${queryString}`);
    const {results} = await respond.json();

    const {genres} = await getAllGenres();

    results.forEach(mov => {
        mov.genres = [];
            for(m_genre of mov.genre_ids) {
                for(genre of genres) {
                    if(m_genre === genre.id) 
                        mov.genres.push(genre.name);
                }
        }
        mov.genres = mov.genres.join(', ');
    })

    results.forEach(mov => mov.backdrop_path = 'http://image.tmdb.org/t/p/original' + mov.backdrop_path )
    results.forEach(mov => mov.poster_path = 'http://image.tmdb.org/t/p/original' + mov.poster_path )
    return results;
}

module.exports.movie = movie;
module.exports.lookupGenre = lookupGenre;