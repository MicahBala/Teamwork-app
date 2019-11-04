import express from 'express';
import articlesRoute from './articles';
// import other routes (gifs, employees and comments) here

const router = express.Router();

router.use(articlesRoute);

export default router;
