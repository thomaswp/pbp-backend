const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const createError = require('http-errors');
const MongoDBStore = require("connect-mongodb-session")(session);

const db = require("./src/models");

const app = express();
const port = process.env.NODE_DOCKER_PORT || 5000;

const { reqLoggerSetup, errLoggerSetup } = require("./src/config/logger.config")

userRouter = require("./src/routes/user.routes");
authRouter = require("./src/routes/auth.routes");
projectRouter = require("./src/routes/project.routes");
assignmentRouter = require("./src/routes/assignment.routes");

// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: "CS-Help-Secret",
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 1, // 1 day
    },
    store: new MongoDBStore({
      uri: db.url,
      collection: "mySessions",
    }),
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.authenticate('session'));
app.use(function(req, res, next) {
  var msgs = req.session.messages || [];
  res.locals.messages = msgs;
  res.locals.hasMessages = !! msgs.length;
  req.session.messages = [];
  next();
});
// setup logging before we handle the requests
reqLoggerSetup(app);

// main apis
app.use("/", authRouter);
app.use("/", userRouter);
app.use("/", projectRouter);
app.use("/", assignmentRouter);

// Swagger API docs
require("./docs")(app);

// log errors
errLoggerSetup(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = {};

  // render the error page
  res.status(err.status || 500);
  res.send(`404 ${err.message}`);
  //res.render('error');
});

app.listen(port, () => {
  console.log(`CS-Help app listening on port ${port}`);
});

// Connect to database
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });
