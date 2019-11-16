import pool from './db_connect';

const createTables = async () => {
  await pool.query('DROP TABLE IF EXISTS articles_table', err => {
    if (err) console.log(err);
    console.log('article dropped successfully');
  });

  await pool.query('DROP TABLE IF EXISTS gif_table', err => {
    if (err) console.log(err);
    console.log('gif table dropped successfully');
  });

  await pool.query('DROP TABLE IF EXISTS comments', err => {
    if (err) console.log(err);
    console.log('comments dropped successfully');
  });

  await pool.query('DROP TABLE IF EXISTS employee', err => {
    if (err) console.log(err);
    console.log('employee dropped successfully');
  });

  // const createCommentsTable =
  //   'CREATE TABLE employee (id BIGSERIAL NOT NULL PRIMARY KEY, comments TEXT, created_on DATE)';

  // const createCommentsTable =
  //   'CREATE TABLE comments (id BIGSERIAL NOT NULL PRIMARY KEY, comments TEXT, created_on DATE)';

  // const createCommentsTable =
  //   'CREATE TABLE articles_table (id BIGSERIAL NOT NULL PRIMARY KEY, comments TEXT, created_on DATE)';

  // const createCommentsTable =
  //   'CREATE TABLE gif_table (id BIGSERIAL NOT NULL PRIMARY KEY, comments TEXT, created_on DATE)';

  // pool.query(createCommentsTable);
  pool.end();
};
