const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const loginRouter = require('./routes/login');
const signupRouter = require('./routes/signup');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const fcmRouter = require('./routes/fcm');

mongoose.connect('mongodb://127.0.0.1:27017/testDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const app = express();
const port = 5000;

// app.all('/*', function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//   res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type,authorization');
//   res.header('Access-Control-Allow-Credentials', true);
//   next();
// });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/login', loginRouter);
app.use('/signup', signupRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);
app.use('/fcm', fcmRouter);
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render("error");
// });

app.get('/', (req, res) => {
  res.send('This is App Server!!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
