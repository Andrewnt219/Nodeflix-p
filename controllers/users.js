const {User, userValidate} = require('../models/user');
const author = require('../middleware/author');

const _ = require('lodash');
const bcrypt = require('bcrypt');
const sgMail = require('@sendgrid/mail');

const express = require('express');
const router = express.Router();

router.post('/register', async (req,res) => {
    const {error} = userValidate(req.body);
    if(error) 
        return res.status(400).render('user/invalid', {errors: error.details});

    const user = new User(_.pick(req.body, ['name', 'email', 'password', 'phone', 'jwt']));

    bcrypt.hash(user.password, 10, async (err, hash) => {
        if(err) throw Error(err);
        user.password = hash;

        user.jwt = await user.generateToken();
        await user.save();
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

    res.render('user/user', _.pick(user, ['name', 'email', 'password', 'phone']));
})

router.post('/login', async (req,res) => {
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('invalid email or password');

    const valid = await bcrypt.compare(req.body.password, user.password);
    if(!valid) return res.status(400).send('Invalid email or password');

    res.header('x-auth-token', user.jwt).send('Logged in');

})

router.get('/me', author, async (req,res) => {
    const user = await User.findOne({email: req.user.email}).select('-password');
    res.send(user.email);
})

module.exports = router;