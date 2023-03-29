const {
	selectCategories,
	selectReviewByID,
	selectReviews,
  selectCommentsByReviewId
} = require('../models/games-models');

const getCategories = (req, res, next) => {
	selectCategories()
		.then((response) => {
			res.status(200).send({ categories: response });
		})
		.catch((err) => {
			next(err);
		});
};

const getReviewByID = (req, res, next) => {
	const { review_id } = req.params;
	selectReviewByID(review_id)
		.then((review) => res.status(200).send({ review: review })
		)
		.catch((err) => {
			next(err);
		});
};

const getReviews = (req, res, next) => {
	selectReviews()
		.then((reviews) => res.status(200).send({ reviews: reviews }))
		.catch((err) => next(err));
};

const getCommentsbyReviewId = (req, res, next) => {
	const { review_id } = req.params;
	selectCommentsByReviewId(review_id)
		.then((comments) => res.status(200).send({ comments: comments }))
		.catch((err) => next(err));
};

module.exports = {
	getCategories,
	getReviewByID,
	getReviews,
	getCommentsbyReviewId,
};
