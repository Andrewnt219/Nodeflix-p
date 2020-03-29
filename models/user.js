const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');

const movieSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    title: {
        type: String
    },
    price: {
        type: Number
    },
    quantity: {
        type: Number,
        default:0
    }
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        default: "Unknown user",
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        maxlength:12,
        minlength:10
    },
    lastLogin: {
        type: Date,
        default: Date.now()
    },
    cart: [movieSchema],
    /* This total should belong to the cart but I don't want to fix all the code */
    total: {
        type: Number,
        default: 0
    },
    wishlist: [{
        id: {
            type: String,
            required: true,
            unique: true
        },
        title: String,
        price: Number
    }],
    isAdmin: {
        type: Boolean,
        default: false
    }
})

userSchema.methods.generateToken = function () {
    return jwt.sign({email: this.email, isAdmin: this.isAdmin, name:this.name}, process.env.jwtPrivateKey, {
        algorithm: 'HS256'
    });
}

userSchema.pre('save', function() {
    this.total = this.cart.reduce((accum, movie) => accum + movie.price*movie.quantity, 0);
})

module.exports.userValidate = function(user) {
    const phone = /(\d{3}[-]*){2}\d{4}$/;
    const schema = Joi.object({
        name: Joi.string()
            .required()
            .min(3)
            .max(255),
        email: Joi.string().email()
            .required()
            .max(255),
        password: Joi.string()
            .required()
            .alphanum()
            .min(8)
            .max(64),
        confirm_password: Joi.any()
            .valid(Joi.ref('password'))
            .error(() => {
                return {
                    message: 'Confirm password does not match.'
                }
            }),
        phone: Joi.string()
            .regex(/(\d{3}[-]*){2}\d{4}$/)
            .error(() => {
                return {
                    message: 'Invalid phone entry! Suggested format: 123-456-7890'
                }
            })
    });

   return schema.validate(user);
}

module.exports.User =  mongoose.model('user', userSchema);
module.exports.movieSchema = movieSchema;

