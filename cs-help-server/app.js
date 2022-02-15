const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const swaggerUI = require("swagger-ui-express");
var csrf = require('csurf');
var cookieParser = require("cookie-parser");
var session = require("express-session");
var passport = require("passport");
var MongoDBStore = require("connect-mongodb-session")(session);

const db = require("./src/models");
const v1_docs = require("./docs/api/v1");

const port = process.env.NODE_DOCKER_PORT || 5000;

userRouter = require("./src/routes/user.routes");
authRouter = require("./src/routes/auth.routes");

// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: "This is a secret",
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 1, // 1 day
    },
    store: new MongoDBStore({
      uri: db.url,
      collection: "mySessions",
    }),
    resave: true,
    saveUninitialized: true,
  })
);
app.use(csrf());
app.use(passport.authenticate('session'));
app.use(function(req, res, next) {
  var msgs = req.session.messages || [];
  res.locals.messages = msgs;
  res.locals.hasMessages = !! msgs.length;
  req.session.messages = [];
  next();
});
app.use(function(req, res, next) {
  res.locals.csrfToken = req.csrfToken();
  next();
});

// main apis
app.use("/", authRouter);
app.use("/", userRouter);

// Swagger API docs
app.use("/api/v1", swaggerUI.serve, swaggerUI.setup(v1_docs));

// test api
app.get("/api", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
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
