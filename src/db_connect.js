import pg from 'pg';

const config = {
  user: 'postgres',
  host: 'localhost',
  database: 'teamwork',
  password: 'micahbala',
  port: 5432
};

const pool = new pg.Pool(config);

pool.on('connect', () => console.log('Connected to database successfully!'));

export default pool;
