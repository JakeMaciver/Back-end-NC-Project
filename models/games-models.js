const db = require('../db/connection');

const selectCategories = () => {
  const selectCategoriesQuery = `
    SELECT * FROM categories
  `

  return db.query(selectCategoriesQuery).then((response) => response.rows);
}

module.exports = {selectCategories};