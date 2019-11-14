import pg from 'pg';
import { PASSWORD } from 'babel-dotenv';

const db = process.env.NODE_ENV === 'test' ? 'test' : 'teamwork';

const config = {
  user: 'postgres',
  host: 'localhost',
  database: `${db}`,
  password: PASSWORD,
  port: 5432
};

const pool = new pg.Pool(config);

pool.on('connect', () =>
  console.log(`Connected to ${db} database successfully`)
);

export default pool;
