const  app  = require('./app');

const {port = 9091 } = process.env;

app.listen(port, () => {
	if (err) console.log(`err: ${err}`);
	else console.log(`listening on port ${port}`);
});
