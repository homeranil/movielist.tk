const express = require('express');
const router = express.Router();

require('./../globals/index');

router.use('/movie', require('./movies/index'));
router.use('/tv', require('./tv/index'));
router.use('/search', require('./search/index'));
router.use('/actors', require('./actors/index'));
router.use('/genres', require('./genres/index'));

module.exports = router;
