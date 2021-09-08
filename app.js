const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const session = require('express-session');

const sign = require('./routes/sign');
const copy = require('./routes/copy');
const user = require('./routes/user');
const oauth = require('./routes/oauth');

const app = express();

const models = require("./models/index.js");

models.sequelize.sync().then( () => {
  console.log(" DB Connected");
}).catch(err => {
  console.log("DB Connection Failed");
  console.log(err);
})


app.use(cors({
    origin : true,
    methods : ["GET","POST","OPTIONS"],
    credentials : true
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use( //세션 : 요청마다 개인의 저장공간
  session({
      secret: '@copymind', //비밀 키 저장
      resave: false, //재저장의 유무
      saveUninitialized: true, 
    })
);

app.use('/', express.static(__dirname + '/public'));
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.use('/sign', sign);
app.use('/copy', copy);
app.use('/user', user);
app.use('/oauth', oauth);

// const serverPort = parseInt(process.env.PORT)
app.listen(process.env.PORT, () => {
  console.log(`Server on port ${process.env.PORT} at ${new Date()}`)
});

module.exports = app;
