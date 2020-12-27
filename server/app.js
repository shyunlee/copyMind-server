const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const sign = require('./routes/sign');
const copy = require('./routes/copy');
const user = require('./routes/user')

const app = express();

app.use(cors({
    origin : true,
    methods : ["GET","POST","OPTIONS"],
    credentials : true
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/sign', sign);
app.use('/copy', copy);
app.use('/user', user);

app.listen(8080);

module.exports = app;
