const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.get('/movies/:id', (req, res) => {
    const id = req.params.id;
    const page = req.query.page > 1 ? req.query.page : 1;
    const name = global.genres.find(g => g.id === parseInt(id));

    fetch(`https://api.themoviedb.org/3/discover/movie?page=${page}&with_genres=${id}&language=he`, global.obj)
        .then(response => response.json())
        .then(json => {
            let response = json.results;
            const subsets = global._.map(response, function(movie) {
                movie['image'] = `${req.full_url}/media/500${movie.poster_path}`;
                movie['genres'] = [];
                movie.genre_ids.forEach(e => {
                    const g = global.genres.find(g => g.id === e);
                    movie['genres'].push(g);
                });
                movie['vote_average'] *= 10;
                return global._.pick(movie, 'id', 'title', 'image', 'genres', 'vote_average', 'release_date');
            });
            res.json({
                data: name,
                movies: subsets
            });
        });
});

router.get('/tv/:id', (req, res) => {
    const id = req.params.id;
    const page = req.query.page > 1 ? req.query.page : 1;
    const name = global.genres.find(g => g.id === parseInt(id));

    fetch(`https://api.themoviedb.org/3/discover/tv?page=${page}&with_genres=${id}&language=he`, global.obj)
        .then(response => response.json())
        .then(json => {
            let response = json.results;
            const subsets = global._.map(response, function(movie) {
                movie['image'] = `${req.full_url}/media/500${movie.poster_path}`;
                movie['genres'] = [];
                movie.genre_ids.forEach(e => {
                    const g = global.genres.find(g => g.id === e);
                    movie['genres'].push(g);
                });
                movie['release_date'] = movie['first_air_date'];
                movie['title'] = movie.name;
                movie['vote_average'] *= 10;
                return global._.pick(movie, 'id', 'title', 'image', 'genres', 'vote_average', 'release_date');
            });
            res.json({
                data: name,
                movies: subsets
            });
        });
});


module.exports = router;
