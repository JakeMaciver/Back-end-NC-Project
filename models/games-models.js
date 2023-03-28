const db = require('../db/connection');

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

module.exports = { selectCategories, selectReviewByID, selectReviews };