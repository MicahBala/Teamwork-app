/* eslint-disable camelcase */
import pool from '../db_connect';

// Get all gifs
export async function getAllGifs(req, res, next) {
  try {
    pool.query('SELECT * FROM gif_table', (error, result) => {
      res.status(200);
      res.send({
        status: 'Success',
        data: result.rows
      });
    });
  } catch (error) {
    res.send({
      status: 'Error',
      error: error.message
    });
  }
}

// Get a single Gif
export async function getSingleGif(req, res, next) {
  const id = parseInt(req.params.id, 10);
  try {
    const getQuery = 'SELECT * FROM gif_table WHERE id = $1';
    const getGif = await pool.query(getQuery, [req.params.id]);

    res.status(200);
    res.send({
      status: 'Success',
      data: {
        message: 'Success',
        id: getGif.rows[0].id,
        createdOn: getGif.rows[0].created_on,
        title: getGif.rows[0].title,
        url: getGif.rows[0].image_url,
        comments: 'New comment'
      }
    });
  } catch (err) {
    res.send({
      status: 'Error',
      error: err.message
    });
  }
}
