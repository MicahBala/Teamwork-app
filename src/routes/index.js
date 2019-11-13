import express from 'express';
import articlesRoute from './articles';
import gifsRoute from './gif';
import usersRoute from './users';
import commentsRoute from './comments';

const router = express.Router();

router.use(articlesRoute);
router.use(gifsRoute);
router.use(usersRoute);
router.use(commentsRoute);

export default router;
