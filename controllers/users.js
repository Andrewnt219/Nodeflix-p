const { User, userValidate } = require('../models/user');
const { Movie } = require('../models/movie');
const author = require('../middleware/author');

const _ = require('lodash');
const bcrypt = require('bcrypt');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const express = require('express');
const router = express.Router();

router.post('/register', async (req, res) => {
    const { error } = userValidate(req.body);
    if (error) {
        const { name, email, phone } = req.body;
        return res.status(400).render('user/register', {
            error: error.details[0].message,
            name: name,
            email: email,
            phone: phone
        });
    }

    const user = new User(_.pick(req.body, ['name', 'email', 'password', 'phone', 'jwt']));

    bcrypt.hash(user.password, 10, async (err, hash) => {
        if (err) throw Error(err);
        user.password = hash;

        user.save()
            .then(async (user) => {
                const msg = {
                    to: `${user.email}`,
                    from: 'tpnguyen12@nodeflix.ca',
                    subject: 'Welcome to Nodeflix!',
                    html: `
                        <strong>Username:</strong> ${user.name}
                        <br>
                        <p>Next step ... </p>   
                    `
                };

                await sgMail.send(msg)

                token = await user.generateToken();
                
                res.cookie('token', token, { signed: true })
                    .redirect('/users/me');
            })
            .catch(err => {
                const { name, email, phone } = req.body;
                if (err.code = 11000)
                    return res.status(400).render('user/register', {
                        error: 'Email has been used',
                        name: name,
                        phone: phone
                    });
                else
                    return res.status(400).render('user/register', { error: err.message });
            });
    })
})

router.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).render('user/login', { error: 'invalid email or password' });

    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) return res.status(400).render('user/login', { error: 'Invalid email or password' });

    user.lastLogin = Date.now();
    await user.save();

    token = await user.generateToken();

    res.cookie('token', token, { signed: true })
        .cookie('status', user.isAdmin ? 'admin' : 'user')
        .cookie('name', user.name)
        .redirect('/users/me');

})

router.get('/me', author, async (req, res) => {
    const user = await User.findOne({ email: req.user.email }).select('-password').lean();

    if (user.isAdmin) {
        return res.redirect('/movies/');
    }
    else {
        res.render('user/user', {
            title: `Welcome back, ${user.name}`,
            user: user
        });
    }

})

router.get('/login', (req, res) => {
    if (req.signedCookies.token) return res.redirect('me');
    res.render('user/login', { title: 'Login' });
})

router.get('/logout', (req, res) => {

    res.cookie('token', '', { expires: new Date('Thu, 01 Jan 1970 00:00:00 GMT') })
        .cookie('status', '', { expires: new Date('Thu, 01 Jan 1970 00:00:00 GMT') })
        .cookie('name', '', { expires: new Date('Thu, 01 Jan 1970 00:00:00 GMT') })
        .redirect('login');
})

router.get('/register', (req, res) => {
    if (req.signedCookies.token) return res.redirect('me');
    res.render('user/register', { title: 'Sign up' });
})

/**
 * Cart
 */
router.get('/cart', author, async (req, res) => {
    const user = await User.findOne({ email: req.user.email }).lean();
    res.render('user/cart', { user: user });
})

router.put('/cart', author, async (req, res) => {

    const movie = await Movie.findOne({ id: req.query.id })
        .select('id price title stock');

    if (movie.stock === 0) return res.render('utils/error', { message: 'We are sorry! This movie is out of stock' });
    movie.stock--;

    const user = await User.findOne({ email: req.user.email });

    let exist = false;
    for (mov of user.cart) {
        if (mov.id == movie.id) {
            mov.quantity++;
            exist = true;
        }
    }
    if (!exist) {
        user.cart.push({
            id: movie.id,
            price: movie.price,
            quantity: 1,
            title: movie.title
        })
    }

    await movie.save();
    await user.save();
    res.redirect(req.headers.referer);
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

router.delete('/cart', author, async (req, res) => {
    const user = await User.findOne({ email: req.user.email });
    const movie = user.cart.id(req.query._id);
    const movieInStock = await Movie.findOne({ id: movie.id });

    if (req.query.quantity === 'all') {
        movieInStock.stock += movie.quantity;
        movie.quantity = 0;
    }
    else {
        movieInStock.stock++;
        movie.quantity--;
    }

    if (movie.quantity == 0) {
        const idx = user.cart.findIndex(mov => mov._id == req.query._id);
        user.cart.splice(idx, 1);
    }

    await user.save();
    await movieInStock.save();

    res.redirect(req.headers.referer);
})


/**
 * Wishlist
 */
router.put('/wishlist', author, async (req, res) => {
    const movie = await Movie.findOne({ id: req.query.id })
        .select('id price title');

    const user = await User.findOne({ email: req.user.email });

    let exist = false;
    for (mov of user.wishlist) {
        if (mov.id == movie.id) {
            exist = true;
        }
    }
    if (!exist) {
        user.wishlist.push({
            id: movie.id,
            price: movie.price,
            title: movie.title
        })
    }

    await movie.save();
    await user.save();
    res.redirect(req.headers.referer);
})

router.delete('/wishlist', author, async (req, res) => {
    const user = await User.findOne({ email: req.user.email });
    const movie = user.wishlist.id(req.query._id);
    const idx = user.wishlist.findIndex(mov => mov._id == req.query._id);

    user.wishlist.splice(idx, 1);

    await user.save();

    res.redirect('dashboard');
})

module.exports = router;