/* eslint-env jest */
import request from 'supertest';
import 'regenerator-runtime';
import app from '../app';
import pool from '../db_connect';

describe('Reach home page, GET /', () => {
  it('should return a OK status code 200', async () => {
    const result = await request(app).get('/');
    expect(result.statusCode).toBe(200);
  });
});

describe('Connect to database', () => {
  beforeAll(async () => {
    await pool.query(
      'CREATE TABLE test_articles_table (id BIGSERIAL NOT NULL PRIMARY KEY, title VARCHAR(50), article TEXT, created_on DATE)',
    );
  });

  beforeEach(async () => {
    await pool.query(
      "INSERT INTO test_articles_table (id, title, article, created_on) values (1, 'Blue Swallow (Cheong yeon)', 'In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum.', '2019-09-21')",
    );
  });

  afterEach(async () => {
    await pool.query('DELETE FROM test_articles_table');
  });

  afterAll(async () => {
    await pool.query('DROP TABLE test_articles_table');
  });

  it('should retrieve articles from the database', async () => {
    const result = await request(app).get('/api/v1/feed/articles');
    expect(result.statusCode).toBe(200);
    expect(result.body.data[0]).toHaveProperty('id');
    expect(result.body.data[0]).toHaveProperty('title');
    expect(result.body.data[0]).toHaveProperty('article');
  });
});
