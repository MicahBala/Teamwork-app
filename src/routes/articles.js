import express from 'express';
import {
  getArticles,
  postNewArticle,
  getSingleArticle
} from '../controllers/articles';

const router = express.Router();

router.get('/api/v1/feed/articles', getArticles);
router.get('/api/v1/articles/:id', getSingleArticle);
router.post('/api/v1/articles', postNewArticle);

export default router;
