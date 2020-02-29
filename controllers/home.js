const express = require('express');
const router = express.Router();

router.get('/', async (req,res) => {
    res.redirect('/movies?sortBy=now_playing');
})

module.exports = router;