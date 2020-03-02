const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

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
        maxlength:12
    },
    jwt: {
        type: String,
        default: ''
    },
    lastLogin: {
        type: Date,
        default: Date.now()
    }
})

userSchema.methods.generateToken = function () {
    return jwt.sign({email: this.email,name: this.name}, process.env.jwtPrivateKey, {
        algorithm: 'RS256',
        expiresIn: process.env.jwtExpirySeconds
    });
}

module.exports.userValidate = function(user) {
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
        confirm_password: Joi.ref('password'),
        phone: Joi.number()
    });

   return schema.validate(user);
}

module.exports.User =  mongoose.model('user', userSchema);

