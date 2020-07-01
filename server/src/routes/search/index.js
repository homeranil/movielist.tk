const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.get('/all', (req, res) => {
    const search = encodeURI(req.query.search);
    fetch(`https://api.themoviedb.org/3/search/multi?query=${search}&language=he&include_image_language=en`, global.obj)
        .then(response => response.json())
        .then(async (json) => {
            let response = json.results;
            console.log(response.length);
            if(response.length > 0){
                await response.map(movie => {
                    movie['genres'] = [];
                    let genre;
                    if(movie.poster_path || movie.profile_path) {
                        // movie['image'] = `https://image.tmdb.org/t/p/w92${movie.poster_path}`;
                        movie['image'] = `${req.full_url}/media/92/${movie.poster_path || movie.profile_path}`;
                    }
                    else {
                        movie['image'] = `${req.full_url}/media/no-image`;
                    }
                    if(movie.media_type !== 'person'){
                        genre = global.genres;
                        movie.genre_ids.forEach(e => {
                            const g = genre.find(g => g.id === e);
                            movie['genres'].push(g);
                        });
                    }
                    return movie;
                });
            }
            res.json(response);
        });
});

module.exports = router;
