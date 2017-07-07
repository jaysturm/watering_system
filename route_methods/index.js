var express = require('express');
var router = express.Router();

// middleware
router.use((req, res, next) => {
    console.log('middleware hit');
    next();
});

router.get('/', (req, res) => {
    res.send('You have reached the Wonka Factory API... please leave a message at the beep.');
});

module.exports = router;