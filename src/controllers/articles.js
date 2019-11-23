/* eslint-disable camelcase */
import Joi from 'joi';
import pool from '../db_connect';
import jwt from 'jsonwebtoken';
import { JWT_SECRETE_KEY } from 'babel-dotenv';

// Get all articles
const getArticles = async (req, res, next) => {
  try {
    pool.query('SELECT * FROM articles_table', (error, result) => {
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
};

// Get a single article
const getSingleArticle = async (req, res, next) => {
  try {
    const getQuery = 'SELECT * FROM articles_table WHERE id = $1';
    const getArticle = await pool.query(getQuery, [parseInt(req.params.id)]);

    if (getArticle.rows[0] === undefined) {
      throw new Error('Article doesnt exist');
    }

    res.status(200);
    res.send({
      status: 'Success',
      data: {
        message: 'Success',
        id: getArticle.rows[0].id,
        createdOn: getArticle.rows[0].created_on,
        title: getArticle.rows[0].title,
        article: getArticle.rows[0].article,
        comments: 'New comment'
      }
    });
  } catch (err) {
    res.send({
      status: 'Error',
      error: err.message
    });
  }
};

//   Post a new article
const postNewArticle = async (req, res, next) => {
  const { title, article, comments_id } = req.body;
  const currentDate = new Date();

  const token = req.headers.token;
  const decodedToken = jwt.verify(token, JWT_SECRETE_KEY);
  const employee_id = decodedToken.userId;

  const schema = {
    title: Joi.string().required(),
    article: Joi.string().required(),
    created_on: Joi.date(),
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
    const newQuery =
      'INSERT INTO articles_table (title, article, created_on, employee_id) VALUES ($1, $2, $3, $4) RETURNING *';
    const newArticle = await pool.query(newQuery, [
      title,
      article,
      currentDate,
      employee_id
    ]);

    res.status(201);
    res.send({
      status: 'Success',
      data: {
        message: 'Article successfully posted',
        articleId: newArticle.rows[0].id,
        createdOn: newArticle.rows[0].created_on.toLocaleString(),
        title: newArticle.rows[0].title
      }
    });
  } catch (err) {
    res.send({
      status: 'Error',
      error: err.message
    });
  }
};

// Update an article
const updateArticle = async (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  const findQuery = 'SELECT * FROM articles_table WHERE id=$1';
  const { title, article } = req.body;
  const updateQuery =
    'UPDATE articles_table SET title=$1, article=$2 WHERE id=$3 RETURNING *';

  try {
    const queryResult = await pool.query(findQuery, [id]);
    // Check if the article exist before attempting to delete
    if (queryResult.rows[0] === undefined) {
      throw new Error('Article doesnt exist');
    }

    const updatedArticle = await pool.query(updateQuery, [title, article, id]);
    res.status(201);
    res.send({
      status: 'Success',
      data: {
        message: 'Article successfully Updated',
        title: updatedArticle.rows[0].title,
        article: updatedArticle.rows[0].article
      }
    });
  } catch (err) {
    res.send({
      status: 'Error',
      error: err.message
    });
  }
};

// Delete and article
const deleteArticle = async (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  const findQuery = 'SELECT * FROM articles_table WHERE id=$1';
  const deleteQuery = 'DELETE FROM articles_table WHERE id=$1';
  try {
    const queryResult = await pool.query(findQuery, [id]);
    // Check if the article exist before attempting to delete
    if (queryResult.rows[0] === undefined) {
      throw new Error('Article doesnt exist');
    }

    // Delete article
    await pool.query(deleteQuery, [id]);
    res.status(200);
    res.send({
      status: 'Success',
      data: {
        message: 'Article successfully deleted'
      }
    });
  } catch (err) {
    res.send({
      status: 'Error',
      error: err.message
    });
  }
};

export {
  getArticles,
  getSingleArticle,
  postNewArticle,
  updateArticle,
  deleteArticle
};
