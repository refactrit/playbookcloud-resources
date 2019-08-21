const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const logger = require('morgan');
const passport = require('passport');
require('./middleware/usernameStrategy.js');

const indexRouter = require('./routes/index.js');
const loginRouter = require('./routes/login.js');
const logoutRouter = require('./routes/logout.js');
const runRouter = require('./routes/run.js');
const integrationRouter = require('./routes/integration.js');

const sessionSecret = '0j2o4i0f8hap9n20npm10u8ibpabnmz0q90Zz0j039j';

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  store: new RedisStore({
    host: 'localhost',
    port: 6379,
    logErrors: true
  }),
  secret: sessionSecret,
  saveUninitialized: true,
  resave: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/integration', integrationRouter);
app.use('/run', runRouter);

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

module.exports = app;
