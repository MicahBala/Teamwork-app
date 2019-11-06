import express from 'express';
import {
  getAllGifs,
  getSingleGif,
  postNewGif,
  deleteGif
} from '../controllers/gifs';

const router = express.Router();

router.get('/api/v1/feed/gifs', getAllGifs);
router.get('/api/v1/gifs/:id', getSingleGif);
router.post('/api/v1/gifs', postNewGif);
router.delete('/api/v1/gifs/:id', deleteGif);

export default router;
