const express = require("express");
const server = express();
const cors = require('cors')
const PORT = 5000
const postRouter = require('./posts/router')

server.use(cors())
server.use(express.json())
server.use('/api/posts', postRouter)

server.listen(PORT, () => {
  console.log(`\n*** Server Running on http://localhost:${PORT} ***\n`)
})