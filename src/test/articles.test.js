/* eslint-env jest */
import request from 'supertest';
import 'regenerator-runtime';
import app from '../app';
process.env.NODE_ENV = 'test';
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
      'CREATE TABLE articles_table (id BIGSERIAL NOT NULL PRIMARY KEY, title VARCHAR(50), article TEXT, created_on DATE, owner_id VARCHAR(5))'
    );
  });

  beforeEach(async () => {
    await pool.query(
      "INSERT INTO articles_table (title, article, created_on, owner_id) values ('Blue Swallow (Cheong yeon)', 'In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum.', '2019-09-21', 3)"
    );
  });

  afterEach(async () => {
    await pool.query('DELETE FROM articles_table');
  });

  afterAll(async () => {
    await pool.query('DROP TABLE articles_table');
  });

  it('should retrieve articles from the database', async () => {
    const result = await request(app).get('/api/v1/feed/articles');
    expect(result.statusCode).toBe(200);
    expect(result.body.data.length).toBe(1);
    expect(result.body.data[0]).toHaveProperty('id');
    expect(result.body.data[0]).toHaveProperty('title');
    expect(result.body.data[0]).toHaveProperty('article');
  });

  it('should post an article to the database', async () => {
    const newArticle = {
      title: 'My New Book',
      article: 'lorem. Integer tincidunt ante vel ipsum.',
      created_on: '2019-11-02',
      owner_id: 2
    };
    const article = await request(app)
      .post('/api/v1/articles')
      .send(newArticle);

    expect(article.body.data.title).toBe('My New Book');
    expect(article.body.data.owner_id).toBe('2');
    expect(article.statusCode).toBe(201);

    const result = await request(app).get('/api/v1/feed/articles');
    expect(result.body.data.length).toBe(2);
  });
});
