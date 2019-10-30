import express from 'express';

const bodyParser = require('body-parser');

const app = express();

app.use((req, res) => {
  res.json({ message: 'Your request is successful!!!' });
});

app.use(bodyParser.json());

// export default app;
module.exports = app;
