
const db = require('./services/db.js')
const express = require('express')
const cors = require('cors')
const authenticator = require('./services/authenticator.js')

const app = express()
const authenticate = authenticator({
  jwks_uri: 'http://127.0.0.1:5556/dex/keys'
})

app.use(require('body-parser').json())
app.use(cors())

app.use(require('./controllers'))

app.get('/', (req, res) => {
  res.send([
    '<h1>ECE DevOps Chat</h1>'
  ].join(''))
})

module.exports = app
