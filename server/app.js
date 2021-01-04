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
  console.log(" DB 연결 성공");
}).catch(err => {
  console.log("연결 실패");
  console.log(err);
})

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());


app.use( //세션 : 요청마다 개인의 저장공간
  session({
      secret: '@copymind', //비밀 키 저장
      resave: false, //재저장의 유무
      saveUninitialized: true, 
    })
);

app.use(express.urlencoded({ extended: false }));

app.use(cors({
  origin : true,
  methods : ["GET","POST","OPTIONS"],
  credentials : true
}))

// app.all('/*', (req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*")
//   res.header("Access-Control-Allow-Headers", "X-Requested-With")
//   next()
// })

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

// app.use(cors({
//   "access-control-allow-origin": "*",
//   "access-control-allow-methods": "GET, POST, OPTIONS",
//   "access-control-allow-headers": "content-type, accept",
//   "access-control-allow-credentials":true,
//   "access-control-max-age": 10 // Seconds.
// }))

app.use('/', express.static(__dirname + '/public'));

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.use('/sign', sign);
app.use('/copy', copy);
app.use('/user', user);

app.use('/oauth', oauth);


app.listen(8080);

module.exports = app;
