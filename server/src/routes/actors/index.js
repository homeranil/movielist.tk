const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.get('/popular', (req, res) => {
    const page = req.query.page > 1 ? req.query.page : 1;
    fetch(`https://api.themoviedb.org/3/person/popular?page=${page}&language=he`, global.obj)
        .then(response => response.json())
        .then(json => {
            const subsets = global._.map(json.results, function(actor) {
                actor['image'] = actor.profile_path
                    ? `${req.full_url}/media/profile${actor.profile_path}`
                    : `${req.full_url}/media/no-image-profile?name=${actor.name}`;
                actor['known_for'] = global._.map(actor['known_for'], function(m) {
                    m['title'] ? '' : m['title'] = m['name'];
                    return global._.pick(m, 'id', 'title', 'media_type');
                });
                return global._.pick(actor, 'id', 'image', 'name', 'known_for');
            });
            res.json(subsets);
        });
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    const append = 'combined_credits,external_ids';
    fetch(`https://api.themoviedb.org/3/person/${id}/?append_to_response=${append}&language=he`, global.obj)
        .then(response => response.json())
        .then(async (actor) => {
            actor['heb'] = true;
            if(actor.profile_path){
                actor['image'] = `${req.full_url}/media/300${actor.profile_path}`;
            }
            else{
                actor['image'] = 'https://via.placeholder.com/300x450';
            }
            if(actor['combined_credits']){
                actor['cast'] = actor['combined_credits']['cast']
                    .sort((a, b) => (a.popularity > b.popularity) ? -1 : 1);

                // actor['cast'] = actor['combined_credits']['cast']
                //     .sort((a, b) => (a.media_type === 'tv' || b.media_type === 'tv')
                //         ? 1 : (a.media_type === 'movie' || b.media_type === 'movie')
                //             ? ((a.popularity > b.popularity) ? -1 : 1) : -1 );

                actor['cast'] = actor['cast'].filter(function(item, pos) {
                    const g = actor['cast'].find(g => g.id === item.id);
                    return actor['cast'].indexOf(g) === pos;
                });

                actor['cast'] = global._.map(actor['cast'], function(cast) {
                    cast.image = cast.poster_path
                        ? `${req.full_url}/media/300${cast.poster_path}`
                        : `${req.full_url}/media/no-image-profile?name=${cast.name}`;

                    cast.title = cast.title ? cast.title : cast.name;
                    return cast;
                });

                actor['know_for'] = actor['cast'].slice(0,5);

                actor['crew'] = actor['combined_credits']['crew']
                    .sort((a, b) => (a.popularity > b.popularity) ? -1 : 1);

                actor['crew'] = global._.map(actor['crew'], function(crew) {
                    crew.image = crew.poster_path
                        ? `${req.full_url}/media/300${crew.poster_path}`
                        : `${req.full_url}/media/no-image-profile?name=${crew.name}`;

                    crew.title = crew.title ? crew.title : crew.name;
                    return crew;
                });


            }
            // if(actor['biography'] === ''){
            //     actor.biography = null;
            //     actor['heb'] = false;
            //     console.log('load new');
            //     await fetch(`https://api.themoviedb.org/3/person/${id}/?language=en`, global.obj)
            //         .then(r => r.json())
            //         .then(j => actor.biography = j.biography);

            // }

            actor['credits'] = [];
            global._.merge(actor['credits'], actor['cast'], actor['crew']);
            actor['credits'] = global._.map(actor['credits'], (credit) => {
                credit['title'] = credit['title'] ? credit['title'] : credit['name'];
                credit['job'] = credit['character'] ? credit['character'] : credit['job'];
                credit['release_date'] = credit['release_date'] || credit['first_air_date'];
                credit = global._.pick(credit, 'id', 'media_type', 'title', 'job', 'release_date', 'image');
                return credit;
            });
            actor['credits'].sort((a, b) => (a.release_date > b.release_date) ? -1 : 1);



            actor = global._.pick(actor, 'id', 'birthday', 'name', 'know_for', 'credits', 'also_known_as', 'biography', 'place_of_birth', 'external_ids', 'homepage', 'image', 'heb', 'gender');
            res.json(actor);
        });
});


module.exports = router;
