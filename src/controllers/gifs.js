/* eslint-disable camelcase */
import Joi from 'joi';
import pool from '../db_connect';
import cloudinary from 'cloudinary';
import { CLOUD_NAME, API_KEY, API_SECRET } from 'babel-dotenv';

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET
});

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

    // Check if the Gif exist before attempting to delete
    if (getGif.rows[0] === undefined) {
      throw new Error('Gif doesnt exist');
    }

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
  const { title } = req.body;
  const uploadImage = req.files.photo;

  const schema = {
    title: Joi.string().required(),
    employee_id: Joi.number(),
    comments_id: Joi.number()
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
    let image = await cloudinary.uploader.upload(
      uploadImage.tempFilePath,
      (err, result) => {
        return result;
      }
    );
    const image_url = image.url;

    const createdOn = new Date();
    const newQuery =
      'INSERT INTO gif_table (image_url, title, created_on) VALUES ($1, $2, $3) RETURNING *';
    const newGif = await pool.query(newQuery, [image_url, title, createdOn]);

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
  const findQuery = 'SELECT * FROM gif_table WHERE id=$1';
  const deleteQuery = 'DELETE FROM gif_table WHERE id=$1';
  try {
    const queryResult = await pool.query(findQuery, [id]);
    // Check if the article exist before attempting to delete
    if (queryResult.rows[0] === undefined) {
      throw new Error('Gif doesnt exist');
    }

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
