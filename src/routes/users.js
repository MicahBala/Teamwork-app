import express from 'express';
import { signinUser, createUser } from '../controllers/users';
import checkAdmin from '../middleware/checkAdmin';

const router = express.Router();

router.post('/api/v1/auth/signin', signinUser);
router.post('/api/v1/auth/create-user', checkAdmin, createUser);

export default router;
