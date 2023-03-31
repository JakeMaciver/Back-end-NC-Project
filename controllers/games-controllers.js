const users = require('../db/data/test-data/users');
const { readFile } = require('fs/promises');
const {
	selectCategories,
	selectReviewByID,
	selectReviews,
  selectCommentsByReviewId,
  insertCommentById,
  updateReview,
  removeCommentById,
  selectUsers,
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
  const { category, sort_by, order } = req.query;

	selectReviews(category, sort_by, order)
		.then((reviews) => res.status(200).send({ reviews: reviews }))
		.catch((err) => {
      next(err)});
};

const getCommentsbyReviewId = (req, res, next) => {
	const { review_id } = req.params;
	selectCommentsByReviewId(review_id)
		.then((comments) => res.status(200).send({ comments: comments }))
		.catch((err) => {
      next(err)});
};

const postCommentById = (req, res, next) => {
	const { review_id } = req.params;
	const { body } = req;

	insertCommentById(review_id, body)
		.then((comment) => {
			res.status(201).send({ comment: comment });
		})
		.catch((err) => {
			next(err);
		});
};

const patchReview = (req, res, next) => {
	let { review_id } = req.params;
	const { body } = req;
  review_id = parseInt(review_id);

	updateReview(review_id, body)
		.then((review) => {
			res.status(200).send({ review: review });
		})
		.catch((err) => {
			next(err);
		});
};

const deleteComment = (req, res, next) => {
	const { comment_id } = req.params;
	removeCommentById(comment_id)
		.then((comment) => {
      res.status(204).send();
    })
		.catch((err) => {
      next(err)});
};

const getUsers = (req, res, next) => {
  selectUsers().then((users) => {
    res.status(200).send({users : users})
  }).catch(err => next(err));
}

const getApi = async (req, res, next) => {
  const endpoints = await readFile(`/${__dirname}/../endpoints.json`, {encoding: 'utf-8'})
  res.status(200).send(endpoints);

}

module.exports = {
	getCategories,
	getReviewByID,
	getReviews,
	getCommentsbyReviewId,
	postCommentById,
	patchReview,
	deleteComment,
  getUsers,
  getApi
};
