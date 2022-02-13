const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const port = process.env.NODE_DOCKER_PORT || 5000;
require("./src/routes/user.routes")(app);

// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api', (req, res) => {
  res.send('Hello World!');
});

const bodyParser = require('body-parser');
// const cors = require('cors');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.post('/email', (req, res) => {
  console.log(req);
  const email = req.body.mail;
  console.log("Email:");
  console.log(email);
  res.send("Email added to database");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})

// Connect to database
const db = require("./src/models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });
