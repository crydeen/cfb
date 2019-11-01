var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
var firebase = require("firebase/app");
require('firebase/database');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCd8mo4E5wem3wt2HIjtx7wSgpWE-gz0FY",
  authDomain: "cfb-pickem-7d492.firebaseapp.com",
  databaseURL: "https://cfb-pickem-7d492.firebaseio.com",
  projectId: "cfb-pickem-7d492",
  storageBucket: "cfb-pickem-7d492.appspot.com",
  messagingSenderId: "321280804312",
  appId: "1:321280804312:web:a37fea8242d87cadefdead"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.use(express.static('public'))

module.exports = app;
