const mongoose = require('mongoose');
const moment = require('moment');

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
    genre: {
        type: Array,
        validate: {
            validator: function(value) {
                return value && value.length > 0
            },
            message: 'There should be at least 1 genre'
        }
    },
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
        default: moment().format(moment.HTML5_FMT.DATE)
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

const Movie = mongoose.model('movie', movieSchema);

module.exports.Movie = Movie;
module.exports.movieSchema = movieSchema;