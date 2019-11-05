import Joi from 'joi';
import pool from '../db_connect';

// Get all articles
export async function getArticles(req, res, next) {
  try {
    await pool.query('SELECT * FROM articles_table', (error, result) => {
      res.status(200);
      res.send({
        status: 'Success',
        data: result.rows
      });
    });
  } catch (err) {
    res.send({
      status: 'Error',
      error: err.message
    });
  }
}

// Get a single article
export async function getSingleArticle(req, res, next) {
  try {
    const getQuery = 'SELECT * FROM articles_table WHERE id = $1';
    const getArticle = await pool.query(getQuery, [req.params.id]);

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
}

//   Post a new article
export async function postNewArticle(req, res, next) {
  const { title, article, created_on, owner_id } = req.body;
  const schema = {
    title: Joi.string().required(),
    article: Joi.string().required(),
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
      'INSERT INTO articles_table (title, article, created_on, owner_id) VALUES ($1, $2, $3, $4) RETURNING *';
    const newArticle = await pool.query(newQuery, [
      title,
      article,
      created_on,
      owner_id
    ]);

    res.status(201);
    res.send({
      status: 'Success',
      data: {
        message: 'Article successfully posted',
        articleId: newArticle.rows[0].id,
        createdOn: newArticle.rows[0].created_on,
        title: newArticle.rows[0].title,
        owner_id: newArticle.rows[0].owner_id
      }
    });
  } catch (err) {
    res.send({
      status: 'Error',
      error: err.message
    });
  }
}

// Update an article
export async function updateArticle(req, res, next) {
  const id = parseInt(req.params.id);
  const { title, article } = req.body;
  const updateQuery =
    'UPDATE articles_table SET title=$1, article=$2 WHERE id=$3 RETURNING *';

  try {
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
}
