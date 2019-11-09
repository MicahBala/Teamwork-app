import express from 'express';
import { signinUser } from '../controllers/users';

const router = express.Router();

router.post('/api/v1/auth/signin', signinUser);

export default router;
