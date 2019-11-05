import express from 'express';
import {
  getArticles,
  postNewArticle,
  getSingleArticle,
  updateArticle
} from '../controllers/articles';

const router = express.Router();

router.get('/api/v1/feed/articles', getArticles);
router.get('/api/v1/articles/:id', getSingleArticle);
router.post('/api/v1/articles', postNewArticle);
router.patch('/api/v1/articles/:id', updateArticle);

export default router;
