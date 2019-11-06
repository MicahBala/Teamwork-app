import express from 'express';
import { getAllGifs } from '../controllers/gifs';

const router = express.Router();

router.get('/api/v1/feed/gifs', getAllGifs);

export default router;
