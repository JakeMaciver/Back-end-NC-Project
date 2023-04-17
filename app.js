const express = require('express');
const {
	getCategories,
	getReviewByID,
	getReviews,
	getCommentsbyReviewId,
	postCommentById,
	patchReview,
  deleteComment,
  getUsers,
  getApi
} = require('./controllers/games-controllers');
const {handle500statusErrors, handle404statusErrors, handle400statusErrors} = require('./controllers/error-handling-controllers');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());

app.get('/api/categories', getCategories);
app.get('/api/reviews/:review_id', getReviewByID);
app.get('/api/reviews', getReviews);
app.get('/api/reviews/:review_id/comments', getCommentsbyReviewId);
app.get('/api/users', getUsers)
app.get('/api', getApi);

app.post('/api/reviews/:review_id/comments', postCommentById);

app.patch('/api/reviews/:review_id', patchReview);

app.delete('/api/comments/:comment_id', deleteComment);

app.use(handle400statusErrors);
app.use(handle404statusErrors);
app.use(handle500statusErrors);

module.exports = app;