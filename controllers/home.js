const express = require('express');
const router = express.Router();

router.get('/', async (req,res) => {
    res.redirect('/genres?sortBy=now_playing');
})

module.exports = router;