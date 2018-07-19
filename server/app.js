const express = require('express');
const logger = require('morgan');
const axios = require('axios');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const speakers = {};

io.on('connection', (socket) => {
  console.log('connected', socket.id);
  socket.on('message', (...args) => {
    let user = args[2];
    if (!user) {
      const time = Date.now();
      if (!speakers[socket.id]) {
        const speakerValues = Object.values(speakers);
        const expiredSpeaker = speakerValues.find(({ lastActivity }) => time - lastActivity > 60000 * 60);
        speakers[socket.id] = { label: expiredSpeaker || `Speaker ${speakerValues.length + 1}` };
      }
      speakers[socket.id].lastActivity = time;
      user = speakers[socket.id].label;
    }
    console.log('broadcasting', ...args.slice(0, 2), user);
    socket.broadcast.send(...args.slice(0, 2), user);
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
