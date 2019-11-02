import express from 'express';
import articlesCtrl from '../controllers/articles';

const router = express.Router();

router.get('/', articlesCtrl.getArticles);

export default router;
