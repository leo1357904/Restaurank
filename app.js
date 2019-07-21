const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const passport = require('./config/passport');
const db = require('./models');
const helpers = require('./config/handlebars-helpers');

const app = express();
const port = process.env.PORT || 3000;
app.engine(
  'handlebars',
  handlebars({
    defaultLayout: 'main',
    helpers,
  }),
); // Handlebars 註冊樣板引擎
app.set('view engine', 'handlebars'); // 設定使用 Handlebars 做為樣板引擎

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use('/upload', express.static(__dirname + '/upload')); //eslint-disable-line

// 把 req.flash 放到 res.locals 裡面
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages');
  res.locals.error_messages = req.flash('error_messages');
  res.locals.user = req.user;
  next();
});

app.use(methodOverride('_method'));

app.listen(port, () => {
  db.sequelize.sync(); // 跟資料庫同步
  console.log(`Example app listening on port ${port}!`);
});

// 引入 routes 並將 app 傳進去，讓 routes 可以用 app 這個物件來指定路由
require('./routes')(app);
