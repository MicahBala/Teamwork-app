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

//   Post a new article
export async function postNewArticle(req, res, next) {
  try {
    const { title, article, created_on, owner_id } = req.body;
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
