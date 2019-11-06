/* eslint-env jest */
import request from 'supertest';
import 'regenerator-runtime';
import app from '../app';
import pool from '../db_connect';

process.env.NODE_ENV = 'test';

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

    await pool.query(
      'CREATE TABLE gif_table (id BIGSERIAL NOT NULL PRIMARY KEY, image_url VARCHAR(200), title VARCHAR(50), created_on DATE, owner_id VARCHAR(5))'
    );
  });

  beforeEach(async () => {
    await pool.query(
      "INSERT INTO articles_table (title, article, created_on, owner_id) values ('Blue Swallow (Cheong yeon)', 'In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum.', '2019-09-21', 3)"
    );

    await pool.query(
      "INSERT INTO gif_table (image_url, title, created_on, owner_id) values ('https://mynewimageurl.com', 'My new sunset image', '2019-09-21', 2)"
    );
  });

  afterEach(async () => {
    await pool.query('DELETE FROM articles_table');
    await pool.query('DELETE FROM gif_table');
  });

  afterAll(async () => {
    await pool.query('DROP TABLE articles_table');
    await pool.query('DROP TABLE gif_table');
  });

  describe('should connect to articles table in database', () => {
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

    it('should retrieve one article from database', async () => {
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

      const result = await request(app).get(
        `/api/v1/articles/${article.body.data.articleId}`
      );

      expect(result.body.data).toHaveProperty('id');
      expect(result.body.data.id).toBe(`${article.body.data.articleId}`);
      expect(result.body.data).toHaveProperty('title');
      expect(result.statusCode).toBe(200);
    });

    it('should update an article in the database', async () => {
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

      const id = parseInt(article.body.data.articleId, 10);
      const result = await request(app)
        .patch(`/api/v1/articles/${id}`)
        .send({
          title: 'Updated Article'
        });

      expect(result.body.data.title).toBe('Updated Article');
    });

    it('should delete an article from the database', async () => {
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

      const id = parseInt(article.body.data.articleId, 10);
      const deletedArticle = await request(app).delete(
        `/api/v1/articles/${id}`
      );

      expect(deletedArticle.statusCode).toBe(200);

      const result = await request(app).get('/api/v1/feed/articles');
      expect(result.body.data.length).toBe(1);
    });
  });

  describe('should connect to gifs table in database', () => {
    it('should retrieve all gifs from the database', async () => {
      const result = await request(app).get('/api/v1/feed/gifs');
      expect(result.statusCode).toBe(200);
      expect(result.body.data.length).toBe(1);
      expect(result.body.data[0]).toHaveProperty('id');
      expect(result.body.data[0]).toHaveProperty('title');
      expect(result.body.data[0]).toHaveProperty('image_url');
    });

    it('should retrieve a single gif from database', async () => {
      // const newGif = {
      //   image_url: 'http://mynewgifaddress.com',
      //   title: 'My New Image',
      //   created_on: '2019-11-02',
      //   owner_id: 1
      // };
      // const gif = await request(app)
      //   .post('/api/v1/gifs/')
      //   .send(newGif);

      // expect(gif.body.data.title).toBe('My New Image');
      // expect(gif.body.data.owner_id).toBe(1);
      // expect(gif.statusCode).toBe(201);

      // const id = parseInt(1, 10);
      const result = await request(app).get('/api/v1/gifs/1');

      // console.log(result.body);

      // expect(result.body.data).toHaveProperty('id');
      // expect(result.body.data.id).toBe(`${gif.body.data.id}`);
      // expect(result.body.data).toHaveProperty('title');
      // expect(result.statusCode).toBe(200);
    });
  });
});
