require('./genres');
global._ = require('lodash');

global.port = process.env.PORT || 5001;
global.apiUrl = process.env.API_URL || `http://localhost:${global.port}`;
global.obj = {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MOVIE_API_KEY}`
    }
};
