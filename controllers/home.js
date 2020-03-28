const express = require('express');
const router = express.Router();

router.get('/', async (req,res) => {
    res.redirect('/collection?sortBy=now_playing');
})

module.exports = router;