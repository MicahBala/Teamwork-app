import express from 'express';
import articlesRoute from './routes/articles';

const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res, next) => res.send('Welcome'));

app.use('/api/v1/feed/articles', articlesRoute);

app.use((req, res, next) => {
  const error = new Error('Route not found!');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.send({
    error: {
      message: error.message,
    },
  });
});

export default app;
