/* eslint-disable camelcase */
import Joi from 'joi';
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
    const getGif = await pool.query(getQuery, [id]);

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

// Post a new Gif
export async function postNewGif(req, res, next) {
  const { image_url, title, created_on, owner_id } = req.body;

  const schema = {
    image_url: Joi.string().required(),
    title: Joi.string().required(),
    created_on: Joi.date().required(),
    owner_id: Joi.number().required()
  };

  const validatedInput = Joi.validate(req.body, schema);

  if (validatedInput.error) {
    res.status(400).send({
      status: 'error',
      error: validatedInput.error.details[0].message
    });
    return;
  }
  try {
    const newQuery =
      'INSERT INTO gif_table (image_url, title, created_on, owner_id) VALUES ($1, $2, $3, $4) RETURNING *';
    const newGif = await pool.query(newQuery, [
      image_url,
      title,
      created_on,
      owner_id
    ]);

    res.status(201);
    res.send({
      status: 'Success',
      data: {
        message: 'Gif image successfully posted',
        gifId: newGif.rows[0].id,
        createdOn: newGif.rows[0].created_on,
        title: newGif.rows[0].title,
        image_url: newGif.rows[0].image_url
      }
    });
  } catch (error) {
    res.send({
      status: 'Error',
      error: error.message
    });
  }
}

// Delete a gif from database
export async function deleteGif(req, res, next) {
  const id = parseInt(req.params.id, 10);
  const deleteQuery = 'DELETE FROM gif_table WHERE id=$1';
  try {
    await pool.query(deleteQuery, [id]);
    res.status(200);
    res.send({
      status: 'Success',
      data: {
        message: 'Gif post successfully deleted'
      }
    });
  } catch (err) {
    res.send({
      status: 'Error',
      error: err.message
    });
  }
}
