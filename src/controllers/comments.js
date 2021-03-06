/* eslint-disable camelcase */
import Joi from 'joi';
import pool from '../db_connect';

// Post article comments
const postArticleComment = async (req, res, next) => {
  const { comment } = req.body;
  const articleId = parseInt(req.params.id);

  const schema = {
    comment: Joi.string().required()
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
    const createdOn = new Date();
    const newQuery =
      'INSERT INTO comments (comments, created_on) VALUES ($1, $2) RETURNING *';
    const updateArticlesTable =
      'UPDATE articles_table SET comments_id=$1 WHERE id=$2';
    const joinQuery =
      'SELECT comments.created_on, articles_table.title, articles_table.article, comments.comments FROM comments JOIN articles_table ON comments.id = articles_table.comments_id';
    const newComment = await pool.query(newQuery, [comment, createdOn]);

    const updateTable = await pool.query(updateArticlesTable, [
      newComment.rows[0].id,
      articleId
    ]);

    const newJoinQuery = await pool.query(joinQuery);

    res.status(201);
    res.send({
      status: 'Success',
      data: {
        message: 'Comment successfully posted',
        createdOn: newComment.rows[0].created_on,
        articleTitle: newJoinQuery.rows[0].title,
        article: newJoinQuery.rows[0].article,
        comment: newComment.rows[0].comments
      }
    });
  } catch (error) {
    res.send({
      status: 'Error',
      error: error.message
    });
  }
};

// Post gif comments
const postGifComment = async (req, res, next) => {
  const { comment } = req.body;
  const gifId = req.params.id;

  const schema = {
    comment: Joi.string().required()
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
    const createdOn = new Date();
    const newQuery =
      'INSERT INTO comments (comments, created_on) VALUES ($1, $2) RETURNING *';
    const updateGifTable = 'UPDATE gif_table SET comments_id=$1 WHERE id=$2';
    const joinQuery =
      'SELECT comments.created_on, gif_table.title, comments.comments FROM comments JOIN gif_table ON comments.id = gif_table.comments_id';

    const newComment = await pool.query(newQuery, [comment, createdOn]);

    const updateTable = await pool.query(updateGifTable, [
      newComment.rows[0].id,
      gifId
    ]);

    const newJoinQuery = await pool.query(joinQuery);

    res.status(201);
    res.send({
      status: 'Success',
      data: {
        message: 'Comment successfully posted',
        createdOn: newComment.rows[0].created_on,
        gifTitle: newJoinQuery.rows[0].title,
        comment: newComment.rows[0].comments
      }
    });
  } catch (error) {
    res.send({
      status: 'Error',
      error: error.message
    });
  }
};

export { postArticleComment, postGifComment };
