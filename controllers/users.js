const {User, userValidate} = require('../models/user');
const author = require('../middleware/author');

const _ = require('lodash');
const bcrypt = require('bcrypt');
const sgMail = require('@sendgrid/mail');

const express = require('express');
const router = express.Router();

router.post('/register', async (req,res) => {
    const {error} = userValidate(req.body);
    if(error) {
        const {name, email, phone} = req.body;
        return res.status(400).render('user/register', {
            error: error.details[0].message,
            name: name,
            email: email,
            phone: phone
        });
    }

    const user = new User(_.pick(req.body, ['name', 'email', 'password', 'phone', 'jwt']));

    bcrypt.hash(user.password, 10, async (err, hash) => {
        if(err) throw Error(err);
        user.password = hash;

        user.jwt = await user.generateToken();
        await user.save()
    })

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: `${user.email}`,
        from: 'tpnguyen12@myseneca.ca',
        subject: 'Welcome to Nodeflix!',
        html: `
            <strong>Username:</strong> ${user.name}
            <br>
            <p>Next step ... </p>   
        `
      };
      
    await sgMail.send(msg)

    res.cookie('token', user.jwt, {maxAge: process.env.jwtExpirySeconds * 1000})
        .redirect('/users/me');
})

router.post('/login', async (req,res) => {
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).render('user/login', {error:'invalid email or password'});

    const valid = await bcrypt.compare(req.body.password, user.password);
    if(!valid) return res.status(400).render('user/login', {error:'Invalid email or password'});

    user.lastLogin = Date.now();
    await user.save();

    res.cookie('token', user.jwt, {maxAge: process.env.jwtExpirySeconds * 1000})
        .redirect('/users/me');

})

router.get('/me', author, async (req,res) => {
    const {name, email, phone, lastLogin} = await User.findOne({email: req.user.email}).select('-password');
    res.render('user/user', {
        title: `Welcome back, ${name}`,
        email: email,
        phone:phone,
        lastLogin: lastLogin
    });
})

router.get('/login', (req,res) => {
    res.render('user/login', {title: 'Login'});
})

router.get('/register', (req,res) => {
    res.render('user/register', {title: 'Sign up'});
})

module.exports = router;