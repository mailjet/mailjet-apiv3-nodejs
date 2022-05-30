const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const mainRoute = require('./routes/index');
const userRoute = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/', mainRoute);
app.use('/users', userRoute);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;

  next(err);
});

switch (app.get('env')) {
  case 'development': {
    app.use((err, req, res, next) => {
      console.log('err => ', err)

      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    });
    break;
  }
  case 'production': {
    app.use((err, req, res, next) => {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {}
      });
    });
    break;
  }
  default: break;
}

module.exports = app;
