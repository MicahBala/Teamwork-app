import express from 'express';
import { postArticleComment, postGifComment } from '../controllers/comments';
import auth from '../middleware/auth';

const router = express.Router();

router.post('/api/v1/articles/:id/comments', auth, postArticleComment);
router.post('/api/v1/gifs/:id/comments', auth, postGifComment);

export default router;
