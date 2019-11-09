import express from 'express';
import articlesRoute from './articles';
import gifsRoute from './gif';
import usersRoute from './users';

const router = express.Router();

router.use(articlesRoute);
router.use(gifsRoute);
router.use(usersRoute);

export default router;
