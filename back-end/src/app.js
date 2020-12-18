const express = require('express')
const cors = require('cors')
const authenticator = require('./services/authenticator')
const router = require('./controllers');
const { errorHandler } = require('./errors')

const app = express()
const authenticate = authenticator({jwks_uri: 'http://127.0.0.1:5556/dex/keys'})

app.get('/', (req, res) => {
  res.send([
    '<h1>ECE DevOps Chat</h1>'
  ].join(''))
})


app.use(require('body-parser').json())
app.use(cors())
// app.use(authenticate)
app.use('/', router)

module.exports = app
