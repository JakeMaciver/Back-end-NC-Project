const  app  = require('./app');

const {PORT = 9091 } = process.env;

app.listen(PORT, (err) => {
	if (err) console.log(`err: ${err}`);
	else console.log(`listening on port ${PORT}`);
});
