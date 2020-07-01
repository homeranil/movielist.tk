const express = require('express');
const router = express.Router();
const path = require('path');
const jwt = require('jsonwebtoken');

const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const User = require('./auth.model');


router.use(passport.initialize());
router.use(passport.session());
router.use(checkTokenSetUser);
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.GITHUB_CALLBACK_URL
        },
        async (accessToken, refreshToken, profile, done) => {
            let user = await User.findOne({
                provider: profile.provider,
                id: profile.id
            });
            if(!user) {
                const newUser = new User({
                    displayName: profile.displayName,
                    email: profile.emails[0].value,
                    username: profile.username,
                    id: profile.id,
                    provider: profile.provider,
                    avatar: profile.photos[0].value,
                    refreshToken,
                    accessToken
                });
                user = await newUser.save();
            }
            done(null, user);
        }
    )
);
router.get('/auth/failed', (req, res, next) => {
    const err = new Error('failed to login');
    res.status(401);
    next(err);
});

router.get('/auth/github',
    passport.authenticate('github'));

router.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/auth/failed' }),
    async (req, res) => {
    // Successful authentication, redirect home.
        const payload = {
            _id: req.user._id
        };
        const token =  await createToken(payload);
        res.redirect('/profile?access_token=' + token);
    });

router.get('/profile',
    (req, res) => {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    });

router.get('/auth/user',
    (req, res) => {
        res.json(req.user);
    });

module.exports = router;

function createToken (payload, expiresIn = process.env.TOKEN_EXPIRES || '1h'){
    return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: expiresIn});
}


function checkTokenSetUser(req, res, next) {
    const authHeader = req.get('Authorization');
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        if (token) {
            // use jwt lib to decode
            jwt.verify(token, process.env.TOKEN_SECRET, async (error, user) => {
                let me = '';
                if (error) {
                    req.user = null;
                }
                else{
                    me = await User.findOne({
                        '_id': user._id
                    });
                }
                req.user = me;
                next();
            });
        }
        else {
            next();
        }
    }
    else {
        next();
    }
}
