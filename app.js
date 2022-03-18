const dotenv = require('dotenv');
dotenv.config();
const connectDb = require('./db');
connectDb();
const express = require('express');
const cookieSession = require('cookie-session');
const morgan = require('morgan');
const passport = require('passport');
const cors = require('cors');
const passportSetup = require('./api/config/passport');
const authRouter = require('./api/routes/auth.router');
const userRouter = require('./api/routes/user.router');
const pinRouter = require('./api/routes/pin.router');
const tableRouter = require('./api/routes/table.router');
const conversationRouter = require('./api/routes/conversation.router');
const commentRouter = require('./api/routes/comment.router');
const subCommentRouter = require('./api/routes/subComment.router');
const app = express();

app.use(morgan('dev')); // show status
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//session
app.use(cookieSession({ name: 'session', keys: ['lama'], maxAge: 24 * 60 * 60 * 100 }));

//passport
app.use(passport.initialize());
app.use(passport.session());

//cors
var corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

//routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/pin', pinRouter);
app.use('/api/table', tableRouter);
app.use('/api/conversation', conversationRouter);
app.use('/api/comment', commentRouter);
app.use('/api/subComment', subCommentRouter);

// Handle error
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

// exports
module.exports = app;
