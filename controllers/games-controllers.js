const {
	selectCategories,
	selectReviewByID,
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

module.exports = { getCategories, getReviewByID };
