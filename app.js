const express = require('express');
const {getCategories} = require('./controllers/games-controllers');
const {handle500statusErrors, handle404statusErrors} = require('./controllers/error-handling-controllers');

const app = express();

app.get('/api/categories', getCategories);

app.use(handle404statusErrors);

module.exports = app;