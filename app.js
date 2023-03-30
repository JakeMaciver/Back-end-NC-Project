const express = require('express');
const {
	getCategories,
	getReviewByID,
	getReviews,
	getCommentsbyReviewId,
	postCommentById,
	patchReview,
  deleteComment
} = require('./controllers/games-controllers');
const {handle500statusErrors, handle404statusErrors, handle400statusErrors} = require('./controllers/error-handling-controllers');

const app = express();

app.use(express.json());

app.get('/api/categories', getCategories);
app.get('/api/reviews/:review_id', getReviewByID);
app.get('/api/reviews', getReviews);
app.get('/api/reviews/:review_id/comments', getCommentsbyReviewId);

app.post('/api/reviews/:review_id/comments', postCommentById);

app.patch('/api/reviews/:review_id', patchReview);

app.delete('/api/comments/:comment_id', deleteComment);

app.use(handle400statusErrors);
app.use(handle404statusErrors);
app.use(handle500statusErrors);

module.exports = app;