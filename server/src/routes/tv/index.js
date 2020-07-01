const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const tvList = (url) => (req, res) => {
    fetch(url, global.obj)
        .then(response => response.json())
        .then(json => {
            let response = json.results;
            response.sort((a, b) => (a.popularity > b.popularity) ? -1 : 1);
            response= response.slice(0,10);
            const subsets = global._.map(response, function(tv) {
                tv['title'] = tv.name;
                tv['image'] = `${req.full_url}/media/500${tv.poster_path}`;
                tv['genres'] = [];
                tv.genre_ids.forEach(e => {
                    const g = global.genres.find(g => g.id === e);
                    tv['genres'].push(g);
                });
                tv['vote_average'] *= 10;
                tv['release_date'] = tv['first_air_date'];
                return global._.pick(tv, 'id', 'title', 'image', 'genres', 'vote_average', 'release_date');
            });
            res.json(subsets);
        });
};

router.get('/popular', tvList('https://api.themoviedb.org/3/tv/popular?language=he&region=IL'));
router.get('/airing_today', tvList('https://api.themoviedb.org/3/tv/airing_today?language=he&region=IL'));
router.get('/on_the_air', tvList('https://api.themoviedb.org/3/tv/on_the_air?language=he&region=IL'));


router.get('/:id', (req, res) => {
    fetch(`https://api.themoviedb.org/3/tv/${req.params.id}?append_to_response=credits,videos,images&language=he&include_image_language=en`, global.obj)
        .then(response => response.json())
        .then(async (json) => {
            let movie = json;
            movie['title'] = movie.name;
            // movie['image'] = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            movie['image'] = `${req.full_url}/media/500${movie.poster_path}`;
            movie.credits.crew = movie.credits.crew.filter((c) => c.job === 'Casting' || c.job === 'Producer');
            if(movie.videos.results.length === 0) {
                movie.videos=null;
                await fetch(`https://api.themoviedb.org/3/tv/${req.params.id}/videos`, global.obj)
                    .then(r => r.json())
                    .then(j => movie.videos = j);
            }

            movie['fullUrl'] = req.full_url;
            movie['vote_average'] *= 10;
            movie.credits.cast = movie.credits.cast.map((img) => {
                img['image'] = img.profile_path ? `${req.full_url}/media/300${img.profile_path}` : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';
                return img;
            });
            movie['release_date'] = movie['first_air_date'];

            movie.created_by = movie.created_by.map((img) => {
                img['image'] = img.profile_path ? `${req.full_url}/media/300${img.profile_path}` : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';
                return img;
            });

            movie = global._.pick(movie, 'id', 'title', 'image', 'genres', 'vote_average', 'overview', 'release_date', 'credits', 'videos', 'images', 'fullUrl', 'created_by');
            res.json(movie);
        });
});

module.exports = router;
