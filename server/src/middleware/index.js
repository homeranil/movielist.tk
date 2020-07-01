const express = require('express');
const router = express.Router();
const cors = require('cors'); // cors middleware
const helmet = require('helmet'); // helmet - headers middleware
const morgan = require('morgan'); // morgan - logger middleware
const cookieParser = require('cookie-parser');


const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');


// use all npm middlewares
router.use(cors());
router.use(helmet());
router.use(morgan('dev'));
router.use(express.json());
router.use(cookieParser());
router.use(require('express-session')({ secret: process.env.SESSION_SECRET || 'fuckThePoasdlice', resave: true, saveUninitialized: true }));

router.use('/media', require('./../routes/media/index'));


router.use(rateLimit({
    windowMs: (process.env.RATE_LIMIT_SEC || 30) * 1000,
    max: process.env.RATE_LIMIT_MAX || 10,
    handler: function (req, res, next) {
        console.log(process.env.RATE_LIMIT_SEC);
        const error = new Error('Too many requests, please try again later.');
        res.status(429);
        next(error);
    }
}));

router.use(slowDown({
    windowMs: (process.env.RATE_LIMIT_SEC || 30) * 1000,
    delayAfter: 5
}));

router.use((req, res, next) => {
    req.full_url = req.protocol + '://' + req.get('host');
    next();
});

module.exports = router;
