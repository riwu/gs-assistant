const express = require('express');
const logger = require('morgan');
const axios = require('axios');

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

app.get('/', (req, res) => {
  res.end();
});
app.get('/favicon.ico', (req, res) => {
  // for browser request
  res.sendStatus(204);
});

app.use(logger('dev'));
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  next();
});

app.post('/translate', (req, res, next) => {
  axios
    .post(`https://translation.googleapis.com/language/translate/v2?key=${
      process.env.REACT_APP_GOOGLE_API_KEY
    }&target=${req.body.languageCode}&q=${encodeURIComponent(req.body.content)}`)
    .then(response => res.send(response.data))
    .catch(next);
});

module.exports = { app, server };
