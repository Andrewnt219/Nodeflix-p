const {User, userValidate} = require('../models/user');
const {Movie} = require('../models/movie');
const author = require('../middleware/author');

const _ = require('lodash');
const bcrypt = require('bcrypt');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const mongoose = require('mongoose');

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
        user.save()
            .then(async (user) => {
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
            
                res.cookie('token', user.jwt)
                    .redirect('/users/me');
            })
            .catch(err => {
                const {name, email, phone} = req.body;
                if(err.code = 11000)
                    return res.status(400).render('user/register', {
                        error: 'Email has been used',
                        name: name,
                        phone: phone
                    });
                else
                    return res.status(400).render('user/register', {error: err.message});
            });
    })
})

router.post('/login', async (req,res) => {
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).render('user/login', {error:'invalid email or password'});

    const valid = await bcrypt.compare(req.body.password, user.password);
    if(!valid) return res.status(400).render('user/login', {error:'Invalid email or password'});

    user.lastLogin = Date.now();
    await user.save();

    res.cookie('token', user.jwt)
        .redirect('/users/me');

})

router.get('/me', author, async (req,res) => {
    const user = await User.findOne({email: req.user.email}).select('-password').lean();
    res.render('user/user', {
        title: `Welcome back, ${user.name}`,
        user: user
    });
})

router.get('/login', (req,res) => {
    if(req.cookies.token) return res.redirect('me');
    res.render('user/login', {title: 'Login'});
})

router.get('/register', (req,res) => {
    res.render('user/register', {title: 'Sign up'});
})

/**
 * Cart
 */
router.put('/cart', author, async (req,res) => {
    const movie = await Movie.findOne({id:req.query.id})
        .select('id price title stock');

    if(movie.stock === 0) return res.render('utils/error', {message: 'We are sorry! This movie is out of stock'});
    movie.stock--;

    const user = await User.findOne({email: req.user.email});
    
    let exist = false;
    for (mov of user.cart) {
        if (mov.id == movie.id )  {
            mov.quantity++;
            exist = true;
        }
    }
    if(!exist) {
        user.cart.push({
            id: movie.id,
            price: movie.price,
            quantity: 1,
            title: movie.title
        })
    }
    
    await movie.save();
    await user.save();
    res.redirect(`/movies/search?id=${req.query.id}`);
    // const session = mongoose.startSession();
    // (await session).startTransaction();
    // try {
    //     const opt = {session, new: true};
    //     await movie.save();
    //     await user.save();
    //     (await session).commitTransaction();
    //     (await session).endSession();
    // } catch (error) {
    //     (await session).abortTransaction();
    //     (await session).endSession();
    //     return res.send('Abort Transaction');
    // }
})

router.delete('/cart',author, async (req,res) => {
    const user = await User.findOne({email: req.user.email});
    const movie = user.cart.id(req.query._id);

    movie.quantity--;
    if(movie.quantity == 0) {
        const idx = user.cart.findIndex(mov => mov._id == req.query._id);
        user.cart.splice(idx, 1);
    }

    await user.save();
    res.redirect('/users/me');
})

module.exports = router;