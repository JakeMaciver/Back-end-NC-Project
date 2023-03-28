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
	return db
		.query(selectReviewByIDQuery, [review_id])
		.then((review) => {
      console.log(review.rowCount);
      if (review.rowCount === 0) return Promise.reject({status : 404});
      else return review.rows
    });
};

module.exports = { selectCategories, selectReviewByID };