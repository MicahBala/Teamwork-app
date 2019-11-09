import express from 'express';
import { signinUser, createUser } from '../controllers/users';

const router = express.Router();

router.post('/api/v1/auth/signin', signinUser);
router.post('/api/v1/auth/create-user', createUser);

export default router;
