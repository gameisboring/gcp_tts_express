var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var { quickStart } = require('./tts')

var app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.send(true)
})
console.log(process.env['GOOGLE_APPLICATION_CREDENTIALS'])
/* app.get('/tts/:text', (req, res) => {
  console.log(req.params.text)
  res.send(req.params.text)
}) */

app.get('/:text/:speakingRate/:speakingVoice', async function (req, res) {
  await quickStart(
    req.params.text,
    req.params.speakingRate,
    req.params.speakingVoice
  )
    .then(() => {
      res.sendFile(__dirname + '/output.mp3')
    })
    .catch((reason) => {
      console.error('quickStart', reason)
      res.send(reason)
    })
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
})

module.exports = app
