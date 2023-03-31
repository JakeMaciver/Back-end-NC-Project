const db = require('../db/connection');
const {checkExists} = require('../db/seeds/utils');

const selectCategories = () => {
  const selectCategoriesQuery = `
    SELECT * FROM categories
  `

  return db.query(selectCategoriesQuery).then((response) => response.rows);
}

const selectReviewByID = (review_id) => {
	const selectReviewByIDQuery = `
    SELECT reviews.*, COUNT (comments.comment_id) AS comment_count
    FROM reviews
    Left JOIN comments ON reviews.review_id = comments.review_id 
    WHERE reviews.review_id = $1
    GROUP BY reviews.review_id;
  `;
	return db.query(selectReviewByIDQuery, [review_id]).then((review) => {
		if (review.rowCount === 0) return Promise.reject({ status: 404 });
		else return review.rows;
	});
};

async function selectReviews(category, sort_by = 'created_at', order = 'desc') {
	if (
		![
			'owner',
			'title',
			'review_id',
			'category',
			'review_img_url',
			'created_at',
			'votes',
			'designer',
			'comments_count',
		].includes(sort_by)
	) {
		return Promise.reject({ status: 400 });
	}

	if (!['asc', 'desc'].includes(order)) {
		return Promise.reject({ status: 400 });
	}

	let queryByCategory = ``;

	if (category) {
		const categoryExists = await checkExists('categories', 'slug', category);
		if (!categoryExists) return Promise.reject({ status: 404 });
		queryByCategory = `WHERE category = ($$${category}$$)`;
	}

	const selectReviewsQuery = `
  SELECT * FROM (
  SELECT owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, designer, COUNT(comments.review_id) AS comment_count
  FROM reviews
  LEFT JOIN comments ON reviews.review_id = comments.review_id
  GROUP BY reviews.review_id
  ORDER BY ${sort_by} ${order}
  ) AS dt
  ${queryByCategory};
  `;

	const { rows } = await db.query(selectReviewsQuery);
	return rows;
}

const selectCommentsByReviewId = async (review_id) => {
	const reviewIdExists = await checkExists('reviews', 'review_id', review_id);

	const selectCommentsByReviewIdQuery = `
  SELECT * FROM comments
  WHERE review_id = $1
  ORDER BY created_at DESC;
  `;

	const { rows } = await db.query(selectCommentsByReviewIdQuery, [review_id]);
	if (!rows.length && reviewIdExists === false)
		return Promise.reject({ status: 404 });
	return rows;
};

const insertCommentById = async (review_id, commentData) => {
	const reviewExists = await checkExists('reviews', 'review_id', review_id);
	const usernameExists = await checkExists(
		'users',
		'username',
		commentData.username
	);

	if (
		commentData.username === '' ||
		commentData.body === '' ||
		!commentData.username ||
		!commentData.body
	)
		return Promise.reject({ status: 400 });
	if (usernameExists === false) return Promise.reject({ status: 404 });
	if (reviewExists === false) return Promise.reject({ status: 404 });

	const insertCommentsQueryStr = `
  INSERT INTO comments
  (body, review_id, author, votes)
  VALUES
  ($1, $2, $3, $4)
  RETURNING *;
  `;

	const { rows } = await db.query(insertCommentsQueryStr, [
		commentData.body,
		review_id,
		commentData.username,
		0,
	]);

	return rows;
};

const updateReview = async (review_id, body) => {
	const { inc_votes } = body;
	review_id = parseInt(review_id);

	const reviewIdExists = await checkExists('reviews', 'review_id', review_id);

	if (!body.inc_votes || typeof body.inc_votes !== 'number' || isNaN(review_id))
		return Promise.reject({ status: 400 });
	if (!reviewIdExists) return Promise.reject({ status: 404 });

	const updateReviewQuery = `
  UPDATE reviews
  SET votes = votes + $1
  WHERE review_id = $2
  RETURNING *;
  `;

	const { rows } = await db.query(updateReviewQuery, [inc_votes, review_id]);
	return rows;
};

const removeCommentById = async (comment_id) => {
	comment_id = parseInt(comment_id);

	const commentIdExists = await checkExists(
		'comments',
		'comment_id',
		comment_id
	);
	if (!commentIdExists) return Promise.reject({ status: 404 });
	if (isNaN(comment_id)) return Promise.reject({ status: 400 });

	const removeCommentByIdQuery = `
  DELETE FROM comments
  WHERE comment_id = $1
  RETURNING *;
  `;

	const { rows } = db.query(removeCommentByIdQuery, [comment_id]);
	return rows;
};

const selectUsers = async () => {
	const selectUsersQuery = `
  SELECT * FROM users;
  `;

	const { rows } = await db.query(selectUsersQuery);
	return rows;
};

module.exports = {
	selectCategories,
	selectReviewByID,
	selectReviews,
	selectCommentsByReviewId,
	insertCommentById,
  updateReview,
  removeCommentById,
  selectUsers,
};