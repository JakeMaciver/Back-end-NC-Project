
const handle400statusErrors = (err, req, res, next) => {
  if (err.code === '22P02') res.status(400).send({message: 'Bad request'}); 
  next(err);
}

const handle404statusErrors = (err, req, res, next) => {
  if(err.status === 404) res.status(404).send({ message: 'Not found' });
  else next(err);
}

const handle500statusErrors = (err, req, res, next) => {
  res.status(500).send({message : 'A server error has occurred.'})
}


module.exports = {handle500statusErrors, handle404statusErrors, handle400statusErrors};