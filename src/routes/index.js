import express from 'express';
import articlesRoute from './articles';
import gifsRoute from './gif';
// import other routes (gifs, employees and comments) here

const router = express.Router();

router.use(articlesRoute);
router.use(gifsRoute);

export default router;
