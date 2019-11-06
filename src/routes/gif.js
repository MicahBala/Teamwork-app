import express from 'express';
import { getAllGifs, getSingleGif, postNewGif } from '../controllers/gifs';

const router = express.Router();

router.get('/api/v1/feed/gifs', getAllGifs);
router.get('/api/v1/gifs/:id', getSingleGif);
router.post('/api/v1/gifs', postNewGif);

export default router;
