const {selectCategories} = require('../models/games-models');

const getCategories = (req, res, next) => {
  selectCategories().then((response) => {
    res.status(200).send({'categories' : response});
  }).catch((err) => {
    next(err);
  })
}

module.exports = {getCategories};