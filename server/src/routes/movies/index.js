const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const genre = global.genres;
const movieList = (url) => (req, res) => {
    fetch(url, global.obj)
        .then(response => response.json())
        .then(json => {
            let response = json.results;
            response.sort((a, b) => (a.popularity > b.popularity) ? -1 : 1);
            response= response.slice(0,10);
            const subsets = global._.map(response, function(movie) {
                movie['image'] = `${req.full_url}/media/500${movie.poster_path}`;
                movie['genres'] = [];
                movie.genre_ids.forEach(e => {
                    const g = genre.find(g => g.id === e);
                    movie['genres'].push(g);
                });
                movie['vote_average'] *= 10;
                return global._.pick(movie, 'id', 'title', 'image', 'genres', 'vote_average', 'release_date');
            });
            res.json(subsets);
        });
};

// fetch('https://api.themoviedb.org/3/genre/movie/list?language=he', global.obj)
//     .then(response => response.json())
//     .then(json => {
//         console.log('Load genres');
//         genre = json.genres;
//     });

router.get('/', (req, res) => {
    res.json({
        message: 'Hello World!'
    });
});

router.get('/popular', movieList('https://api.themoviedb.org/3/movie/popular?language=he&region=IL'));

router.get('/now_playing', movieList('https://api.themoviedb.org/3/movie/now_playing?language=he&region=IL'));

router.get('/:id', (req, res) => {
    fetch(`https://api.themoviedb.org/3/movie/${req.params.id}?append_to_response=credits,videos,images&language=he&include_image_language=en`, global.obj)
        .then(response => response.json())
        .then(async (json) => {
            let movie = json;
            // movie['image'] = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            movie['image'] = `${req.full_url}/media/500${movie.poster_path}`;
            movie.credits.crew = movie.credits.crew.filter((c) => c.job === 'Casting' || c.job === 'Producer');
            if(movie.videos.results.length === 0) {
                movie.videos=null;
                await fetch(`https://api.themoviedb.org/3/movie/${req.params.id}/videos`, global.obj)
                    .then(r => r.json())
                    .then(j => movie.videos = j);
            }

            movie['fullUrl'] = req.full_url;
            movie['vote_average'] *= 10;
            movie.credits.cast = movie.credits.cast.map((img) => {
                img['image'] = img.profile_path ? `${req.full_url}/media/300${img.profile_path}` : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';
                return img;
            });

            movie = global._.pick(movie, 'id', 'title', 'image', 'genres', 'vote_average', 'overview', 'release_date', 'credits', 'videos', 'images', 'fullUrl');
            res.json(movie);
        });
});

module.exports = router;
