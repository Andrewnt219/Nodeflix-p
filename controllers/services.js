const express = require('express');
const router = express.Router();
const author = require('../middleware/author');

const { User } = require('../models/user');
const Order = require('../models/order');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.use(author);
router.get('/order', async (req, res) => {
    const user = await User.findOne({ email: req.user.email }).select('email id name cart total');

    if (user.cart.length === 0) return res.render('service/order', { title: 'No items are in the shopping cart' })
    let order = new Order({
        user: {
            id: user.id,
            name: user.name
        },
        movies: user.cart,
        hst: 0.13,
        total: user.total
    })
    user.cart = [];

    await order.save();
    await user.save();

    function list(items) {
        return items.reduce((accum, item) => accum +`
            <tr>
                <td>${item.title}</td>
                <td>${item.quantity}</td>
                <td>${item.price}</td>
            </tr>
        `, '');
    }

    const msg = {
        to: `${user.email}`,
        from: 'tpnguyen12@nodeflix.ca',
        subject: `Order's confirmation`,
        html: `
            <p>Dear ${user.name},

            <table border="1" style="border-collapse: collapse;">
                <title>Order Summary</title>
                <thead>
                    <th>Title</th>
                    <th>Quantity</th>
                    <th>Price</th>
                </thead>

                <tbody>
                    ${list(order.movies)}
                </tbody>

                <tfoot>
                    <tr>
                        <td>Total</td>
                        <td colspan="2">${order.total}</td>
                    </tr>
                </tfoot>
            </table>
        `
    };

    await sgMail.send(msg)

    res.render('utils/error', {
        title: 'Your order is on its way',
        message: 'Check your email for more information'
    })
})

module.exports = router;