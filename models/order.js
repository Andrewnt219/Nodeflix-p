const mongoose = require('mongoose');

const {movieSchema} = require('./user');

orderSchema = new mongoose.Schema({
    user: {
        id: String,
        name: String
    },
    movies:[movieSchema],
    hst: {
        type: Number,
        required: true,
        validate: {
            validator: function(v) {
                return v <= 1 && v >= 0;
            },
            message: 'HST ranges from 0 to 1 (inclusive)'
        }
    },
    total: {
        type: Number,
        default: 0
    },
    createdDate: {
        type: Date,
        default: Date.now()
    }
});

const Order = mongoose.model('order', orderSchema);

module.exports = Order;