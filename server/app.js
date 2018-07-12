const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

io.on('connection', (socket) => {
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

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.send('error');
});

module.exports = { app, server };
