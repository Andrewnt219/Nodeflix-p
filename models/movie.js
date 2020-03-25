const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    popularity: {
        type: Number,
        default: 0.0
    },
    vote_count: {
        type: Number,
        default: 0.0
    },
    video: {
        type: Boolean,
        default:false
    },
    poster_path: {
        type: String,
        default: '/img/404.png'
    },
    id: {
        type: Number,
        required: true,
        unique: true
    },
    adult: {
        type: Boolean,
        default: false
    },
    backdrop_path: {
        type: String,
        default: '/img/404.png'
    },
    original_language: {
        type: String,
        default: 'en'
    },
    original_title: String,
    genre: [String],
    title: {
        type: String,
        required: true
    },
    vote_average: {
        type: Number,
        default: 0.0
    },
    release_date: {
        type: Date,
        default: Date.now()
    },
    overview: String,
    price: {
        type:Number,
        default: function() { 
            const newPrice = 12 - (Date.now() - this.release_date.getTime());
            return  newPrice < 2 ? 2 : newPrice;        
        }
    },
    stock: {
        type: Number,
        default: 15,
    },
})

const Movie = mogngoose.model('movie', movieSchema);

module.exports.Movie = Movie;
module.exports.movieSchema = movieSchema;