const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes');
const path = require('path');

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', routes);

app.listen(5000, () => {
  console.log('Backend running on http://localhost:5000');
});
