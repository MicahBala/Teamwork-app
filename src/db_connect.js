import pg from 'pg';

const db = process.env.NODE_ENV === 'test' ? 'test' : 'teamwork';

const config = {
  user: 'postgres',
  host: 'localhost',
  database: `${db}`,
  password: 'micahbala',
  port: 5432
};

const pool = new pg.Pool(config);

pool.on('connect', () =>
  console.log(`Connected to ${db} database successfully`)
);

export default pool;
