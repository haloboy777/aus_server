const express = require('express');
const cors = require('cors');
const API_HANDLERS = require('./apiHandlers')
const app = express();

app.use(express.static('public'));
app.use(cors());

app.get('/api/search', API_HANDLERS.search)
app.get('/api/getActorDetails', API_HANDLERS.getActor)
app.get('/api/getFilmLocations', API_HANDLERS.getFilmLocations)

app.listen(8000, () => console.log("server is running on port 8000 and path /api/"))