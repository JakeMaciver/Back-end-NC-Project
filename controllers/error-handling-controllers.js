
const handle404statusErrors = (err, req, res, next) => {
  if(err.status === 404) res.status(404).send({ msg: 'Not found.' });
  else next(err);
}

const handle500statusErrors = (err, req, res, next) => {
  res.status(500).send({msg : 'A server error has occurred.'})
}


module.exports = {handle500statusErrors, handle404statusErrors};