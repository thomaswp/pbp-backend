const express = require('express')
const app = express()
const port = process.env.NODE_DOCKER_PORT || 5000

app.get('/api', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})