const express = require('express');
const cors = require('cors');
const boolParser = require('express-query-boolean');
const session = require('express-session');
const passport = require('passport');
const connection = require('./config/database');
const MongoStore = require('connect-mongo')(session);
const cron = require('node-cron');
require('dotenv').config();

// General set up
const app = express();
const port = process.env.PORT || 5000;

// Middleware stack
app.use(cors({ credentials: true, origin: process.env.ORIGIN }));
app.use(express.json());
app.use(boolParser());
app.use(express.urlencoded({ extended: true }));

// Session set up
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: connection, collection: 'sessions' }),
  cookie: {
    secure: true,
    maxAge: 1000 * 60 * 60 * 24,  // Equals one day
    sameSite: "none"
  }
}));

// Set HTTP headers for CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.ORIGIN);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Passport authentication
require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

// Set routes
const userRouter = require('./routes/userRoute');
const healthCheckRouter = require('./routes/healthCheckRoute');
app.use('/users', userRouter);
app.use('/healthcheck', healthCheckRouter);

// Schedule CRON job for user email notifications
// Runs everyday at 6:30PM AEST, 30 minutes after
// all user products are updated on MongoDB Realm
const emailUsers = require('./realm/emailUsers');
cron.schedule('30 20 * * *', emailUsers);

// Server setup
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});