const express = require('express');
const {getCategories, getReviewByID} = require('./controllers/games-controllers');
const {handle500statusErrors, handle404statusErrors, handle400statusErrors} = require('./controllers/error-handling-controllers');

const app = express();

app.get('/api/categories', getCategories);
app.get('/api/reviews/:review_id', getReviewByID);

app.use(handle400statusErrors);
app.use(handle404statusErrors);
app.use(handle500statusErrors);

module.exports = app;