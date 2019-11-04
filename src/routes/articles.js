import express from 'express';
import { getArticles, postNewArticle } from '../controllers/articles';

const router = express.Router();

router.get('/api/v1/feed/articles', getArticles);
router.post('/api/v1/articles', postNewArticle);

export default router;
