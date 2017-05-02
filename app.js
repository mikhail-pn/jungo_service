const express = require('express');
const bodyParser = require('body-parser');
const router = require('./router');
const errHandler = require('./error_handler');

const PORT = 3003;
const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(router);
app.use(errHandler);

app.listen(PORT);
console.log('Server started on %s port', PORT);
