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
    SELECT * FROM reviews 
    WHERE review_id = $1;
  `;
	return db.query(selectReviewByIDQuery, [review_id]).then((review) => {
		if (review.rowCount === 0) return Promise.reject({ status: 404 });
		else return review.rows;
	});
};

const selectReviews = () => {
	const selectReviewsQuery = `
  SELECT owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, designer, COUNT(comments.review_id) AS comment_count
  FROM reviews
  LEFT JOIN comments ON reviews.review_id = comments.review_id
  GROUP BY reviews.review_id
  ORDER BY reviews.created_at DESC, reviews.review_id DESC;
  `;
	return db.query(selectReviewsQuery).then(({ rows }) => rows);
};

const selectCommentsByReviewId = async (review_id) => {
  const reviewIdExists = await checkExists('reviews', 'review_id', review_id);

  const selectCommentsByReviewIdQuery = `
  SELECT * FROM comments
  WHERE review_id = $1
  ORDER BY created_at DESC;
  `

  const {rows} = await db.query(selectCommentsByReviewIdQuery, [review_id]);
  if (!rows.length && reviewIdExists === false) return Promise.reject({status: 404});
  return rows;
}

const insertCommentById = async (review_id, commentData) => {
	const reviewExists = await checkExists('reviews', 'review_id', review_id)
  const usernameExists = await checkExists('users', 'username', commentData.username);

  if (
		commentData.username === '' ||
		commentData.body === '' ||
		!commentData.username ||
		!commentData.body
	)
		return Promise.reject({ status: 400 });
  if(usernameExists === false) return Promise.reject({status: 404});
  if(reviewExists === false) return Promise.reject({ status: 404 });

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

module.exports = {
	selectCategories,
	selectReviewByID,
	selectReviews,
	selectCommentsByReviewId,
	insertCommentById,
};