const  app  = require('./app');

const {PORT = 9091 } = process.env;

app.listen(PORT, () => {
	if (err) console.log(`err: ${err}`);
	else console.log(`listening on port ${PORT}`);
});
