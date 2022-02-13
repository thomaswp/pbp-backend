const express = require('express')
const app = express()

const port = 8000

const path = require('path')

app.get('/', (req, res) => {
  // res.send('Hello World!')
  res.sendFile(path.join(__dirname, "../pbp/login.html"))
})

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
  console.log(`Example app listening on port ${port}`)
})
