import express from 'express';
import { getAllGifs, getSingleGif } from '../controllers/gifs';

const router = express.Router();

router.get('/api/v1/feed/gifs', getAllGifs);
router.get('/api/v1/gifs/:id', getSingleGif);

export default router;
