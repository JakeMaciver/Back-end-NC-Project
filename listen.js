const { app } = require('./app');
const port = 9090;

app.listen(port, () => {
	if (err) console.log(`err: ${err}`);
	else console.log(`listening on port ${port}`);
});