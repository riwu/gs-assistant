const express = require('express');
const logger = require('morgan');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('connected', socket.id);
  socket.on('message', (...args) => {
    console.log('broadcasting', args);
    socket.broadcast.send(...args);
  });
});

app.use(logger('dev'));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Socket server running');
});
app.get('/favicon.ico', (req, res) => {
  // for browser request
  res.sendStatus(204);
});

module.exports = { app, server };
