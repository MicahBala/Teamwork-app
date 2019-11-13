import express from 'express';
import {
  getAllGifs,
  getSingleGif,
  postNewGif,
  deleteGif
} from '../controllers/gifs';
import auth from '../middleware/auth';

const router = express.Router();

router.get('/api/v1/feed/gifs', auth, getAllGifs);
router.get('/api/v1/gifs/:id', auth, getSingleGif);
router.post('/api/v1/gifs', auth, postNewGif);
router.delete('/api/v1/gifs/:id', auth, deleteGif);

export default router;
