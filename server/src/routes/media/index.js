const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const getImage = async (req, res) => {
    let size = req.params.size;
    if(size === 'original') {
        size = 'original';
    }
    else if(size === 'profile') {
        size = 'w235_and_h235_face';
    }
    else{
        size = `w${size}`;
    }
    const url = `https://image.tmdb.org/t/p/${size}/${req.params.image}`;
    await fetch(url)
        .then(response => {
            res.status(response.status);
            res.set('Content-Type', response.headers.get('content-type'));
            return response.buffer();
        }).then(body => res.end(body));
};


const noImage = (size = '50x75') => (req, res) => {
    const url = 'https://via.placeholder.com/' + size;
    res.redirect(301, url);
};

const noImageProfile = (size = '235') => async (req, res) => {
    req.query.size ? size = req.query.size : '';
    const url = 'https://ui-avatars.com/api/?size=' + size + '&name=' + req.query.name;
    await fetch(url)
        .then(response => {
            res.status(response.status);
            res.set('Content-Type', response.headers.get('content-type'));
            return response.buffer();
        }).then(body => res.end(body));
};

router.get('/:size/:image', getImage);
router.get('/:size//:image', getImage);
router.get('/no-image', noImage());
router.get('/no-image-profile', noImageProfile());


module.exports = router;
