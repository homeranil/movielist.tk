const express = require('express');
require('dotenv').config();

const app = express();

require('./plugins/db');

app.set('trust proxy', 1);

const midllewares = require('./middleware');
app.use (midllewares);

const passport = require('./auth/passport');
app.use(passport);

const routers = require('./routes');
app.use(routers);


// Errors Handelr
app.use((req, res, next) => {
    res.status(404);
    const error = new Error(`Not Found - ${  req.originalUrl}`);
    next(error);
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    // console.log(err);
    res.status(res.statusCode || 500);
    res.json({
        error: true,
        message: err.message
    });
});
module.exports = app;
