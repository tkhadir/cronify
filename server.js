const express = require('express')
const http = require('http')
const app = express()
app.use(express.static("public"))
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
const PORT = 3000
require('./routes')(app)
const server = http.createServer(app)
module.exports = {
    server: server,
    PORT: PORT
}