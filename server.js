'use strict'

const express = require('express')
const app = express()
const server = require('http').Server(app);
const io = require('socket.io')(server);


app.set('view engine', 'pug')
app.set('port', 3000)
app.set('address', '127.0.0.1')
app.disable('x-powered-by')
app.use('/static', express.static('static'))

app.get('/', (req, res) => {
  res.render('index')
})

io.on('connection', function (socket) {
  socket.on('triggerSound', function (data) {
    io.emit('playSound', data)
  })
})

server.listen(app.get('port'), app.get('address'), () => {
  console.log(`Listening on ${app.get('address')}:${app.get('port')}`)
})