import pool from '../db_connect';

exports.getArticles = async (req, res, next) => {
  await pool.query('SELECT * FROM articles_table', (error, result) => {
    if (error) {
      throw error;
    }

    res.status(200);
    res.send({
      status: 'Success',
      data: result.rows,
    });
  });
};
