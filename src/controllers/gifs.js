/* eslint-disable camelcase */
import pool from '../db_connect';

// Get all gifs
export async function getAllGifs(req, res, next) {
  try {
    pool.query('SELECT * FROM gif_table', (error, result) => {
      res.status(200);
      res.send({
        status: 'Success',
        data: result.rows,
      });
    });
  } catch (error) {
    res.send({
      status: 'Error',
      error: error.message,
    });
  }
}
