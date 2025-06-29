const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3001;

console.log('✅ Starting plain JS Express app...');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url}`);
  next();
});

app.get('/ping', (req, res) => {
  console.log('🔁 Ping route hit');
  res.send('pong');
});

app.listen(port, () => {
  console.log(`✅ Server listening at http://localhost:${port}`);
});
