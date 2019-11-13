import express from 'express';
import {
  getArticles,
  postNewArticle,
  getSingleArticle,
  updateArticle,
  deleteArticle
} from '../controllers/articles';
import auth from '../middleware/auth';

const router = express.Router();

router.get('/api/v1/feed/articles', auth, getArticles);
router.get('/api/v1/articles/:id', auth, getSingleArticle);
router.post('/api/v1/articles', auth, postNewArticle);
router.patch('/api/v1/articles/:id', auth, updateArticle);
router.delete('/api/v1/articles/:id', auth, deleteArticle);

export default router;
