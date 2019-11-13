import express from 'express';
import { postArticleComment, postGifComment } from '../controllers/comments';

const router = express.Router();

router.post('/api/v1/articles/:id/comments', postArticleComment);
router.post('/api/v1/gifs/:id/comments', postGifComment);

export default router;
