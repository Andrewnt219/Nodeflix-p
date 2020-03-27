const mongoose = require('mongoose');
const moment = require('moment');


const movieSchema = new mongoose.Schema({
    category: {
        type: String,
        default: 'Others'
    },
    popularity: {
        type: Number,
        default: Math.round(Math.random() * (50000 - 1000)) + 1
    },
    vote_count: {
        type: Number,
        default: function () {
            return Math.round(Math.random() * (this.popularity / 3 - 0)) + 1;
        }
    },
    video: {
        type: Boolean,
        default: false
    },
    poster_path: {
        type: String,
        validate: {
            validator: function (v) {
                return v.match(/.*(jpg|jpeg|png|bmp)/)
            },
            message: 'Invalid image\'s extension. Allowed types are jpg, jpeg, png, and bmp'
        }
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
        validate: {
            validator: function (v) {
                return v.match(/.*(jpg|jpeg|png|bmp)/)
            },
            message: 'Invalid image\'s extension. Allowed types are jpg, jpeg, png, and bmp'
        }
    },
    original_language: {
        type: String
    },
    original_title: String,
    genre: {
        type: Array,
        validate: {
            validator: function (value) {
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
        default: (Math.random() * (10 - 1 + 1) + 1).toFixed(1)
    },
    release_date: {
        type: Date
    },
    overview: String,
    price: {
        type: Number,
        default: function () {
            const newPrice = 15 - moment().diff(this.release_date, 'd');
            return newPrice < 3 ? 3 : newPrice;
        }
    },
    stock: {
        type: Number,
        default: Math.round(Math.random() * (15-10+1)) + 10
    },
    best_seller: {
        type: Boolean,
        default: false
    }
}, {toObject: {getters: true}, toJSON: {getters: true}})

movieSchema.statics.id = 211111;
movieSchema.statics.idGenerator = function () {
    return this.id += 3;
}

movieSchema.pre('save', function () {
    if (moment(this.release_date).isAfter(moment()))
        this.category = 'upcoming';
    else if (moment(this.release_date) > moment().subtract(2, 'w'))
        this.category = 'now_playing';
    else if (this.vote_average > 7.5)
        this.category = 'top_rated';
    else if (this.popularity > 20000)
        this.category = 'popular';

    if (this.popularity > 20000 && this.vote_average > 7.5)
        this.best_seller = true;
})


const Movie = mongoose.model('movie', movieSchema);

module.exports.Movie = Movie;
module.exports.movieSchema = movieSchema;