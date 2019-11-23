/* eslint-env jest */
import request from 'supertest';
import 'regenerator-runtime';
import app from '../app';
import pool from '../db_connect';
import bcrypt from 'bcryptjs';

let authToken;
const created_on = new Date();
process.env.NODE_ENV = 'test';

describe('Reach home page, GET /', () => {
  it('should return a OK status code 200', async () => {
    const result = await request(app).get('/');
    expect(result.statusCode).toBe(200);
  });
});

describe('Connect to database', () => {
  beforeAll(async () => {
    try {
      await pool.query(
        'CREATE TABLE employee (id BIGSERIAL NOT NULL PRIMARY KEY, first_name VARCHAR(50) NOT NULL, last_name VARCHAR(50) NOT NULL, email VARCHAR(50) NOT NULL, password TEXT NOT NULL, gender VARCHAR(50) NOT NULL, job_role VARCHAR(50) NOT NULL, department VARCHAR(50) NOT NULL, is_admin BOOLEAN DEFAULT false, address TEXT)'
      );
      await pool.query(
        'CREATE TABLE comments (id BIGSERIAL NOT NULL PRIMARY KEY, comments TEXT, created_on DATE)'
      );
      await pool.query(
        'CREATE TABLE articles_table (id BIGSERIAL NOT NULL PRIMARY KEY, title TEXT, article TEXT, created_on DATE, employee_id BIGINT REFERENCES employee(id), comments_id BIGINT REFERENCES comments(id))'
      );
      await pool.query(
        'CREATE TABLE gif_table (id BIGSERIAL NOT NULL PRIMARY KEY, image_url TEXT, title TEXT, created_on DATE, employee_id BIGINT REFERENCES employee(id), comments_id BIGINT REFERENCES comments(id))'
      );
    } catch (error) {
      console.log(error);
    }
  });
  beforeEach(async () => {
    try {
      const hashpassword = await bcrypt.hash('johndoe', 2);
      const insertQuery =
        'INSERT INTO employee (first_name, last_name, email, password, gender, job_role, department, address) values ($1, $2, $3, $4, $5, $6, $7, $8)';
      const user = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@mymail.com',
        password: hashpassword,
        gender: 'Female',
        jobRole: 'Analyst',
        department: 'Sports',
        address: 'Kaduna'
      };
      await pool.query(insertQuery, [
        user.firstName,
        user.lastName,
        user.email,
        user.password,
        user.gender,
        user.jobRole,
        user.department,
        user.address
      ]);
      const response = await request(app)
        .post('/api/v1/auth/signin')
        .send({
          email: 'johndoe@mymail.com',
          password: 'johndoe'
        });
      authToken = response.body.data.token;
      await pool.query(
        "INSERT INTO comments (comments, created_on) values ('Very good piece...!', $1)",
        [created_on]
      );
      await pool.query(
        "INSERT INTO articles_table (title, article) values ('Blue Swallow (Cheong yeon)', 'In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum.')"
      );
      await pool.query(
        "INSERT INTO gif_table (image_url, title, created_on) values ('http://dummyimage.com/248x140.png/5fa2dd/ffffff', 'The End of the Tour', $1)",
        [created_on]
      );
    } catch (error) {
      console.log(error);
    }
  });
  afterEach(async () => {
    await pool.query('DELETE FROM articles_table');
    await pool.query('DELETE FROM gif_table');
    await pool.query('DELETE FROM comments');
    await pool.query('DELETE FROM employee');
  });
  afterAll(async () => {
    await pool.query('DROP TABLE articles_table');
    await pool.query('DROP TABLE gif_table');
    await pool.query('DROP TABLE comments');
    await pool.query('DROP TABLE employee');
    await pool.end();
  });

  describe('should connect to articles table in database', () => {
    it('should retrieve articles from the database', async () => {
      const result = await request(app)
        .get('/api/v1/feed/articles')
        .set('token', authToken);
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
        created_on: new Date()
      };
      const article = await request(app)
        .post('/api/v1/articles')
        .set('token', authToken)
        .send(newArticle);

      expect(article.body.data.title).toBe('My New Book');
      expect(article.statusCode).toBe(201);

      const result = await request(app)
        .get('/api/v1/feed/articles')
        .set('token', authToken);
      expect(result.body.data.length).toBe(2);
    });

    it('should retrieve one article from database', async () => {
      const newArticle = {
        title: 'My New Book',
        article: 'lorem. Integer tincidunt ante vel ipsum.',
        created_on: new Date()
      };
      const article = await request(app)
        .post('/api/v1/articles')
        .set('token', authToken)
        .send(newArticle);
      expect(article.body.data.title).toBe('My New Book');
      expect(article.statusCode).toBe(201);

      const result = await request(app)
        .get(`/api/v1/articles/${article.body.data.articleId}`)
        .set('token', authToken);

      expect(result.body.data).toHaveProperty('id');
      expect(result.body.data.id).toBe(`${article.body.data.articleId}`);
      expect(result.body.data).toHaveProperty('title');
      expect(result.statusCode).toBe(200);
    });

    it('should update an article in the database', async () => {
      const newArticle = {
        title: 'My New Book',
        article: 'lorem. Integer tincidunt ante vel ipsum.',
        created_on: new Date()
      };
      const article = await request(app)
        .post('/api/v1/articles')
        .set('token', authToken)
        .send(newArticle);
      expect(article.body.data.title).toBe('My New Book');
      expect(article.statusCode).toBe(201);

      const id = parseInt(article.body.data.articleId, 10);
      const result = await request(app)
        .patch(`/api/v1/articles/${id}`)
        .set('token', authToken)
        .send({
          title: 'Updated Article'
        });
      expect(result.body.data.title).toBe('Updated Article');
    });

    it('should delete an article from the database', async () => {
      const newArticle = {
        title: 'My New Book',
        article: 'lorem. Integer tincidunt ante vel ipsum.',
        created_on: new Date()
      };

      const article = await request(app)
        .post('/api/v1/articles')
        .set('token', authToken)
        .send(newArticle);
      expect(article.body.data.title).toBe('My New Book');
      expect(article.statusCode).toBe(201);
      const id = parseInt(article.body.data.articleId, 10);

      const deletedArticle = await request(app)
        .delete(`/api/v1/articles/${id}`)
        .set('token', authToken);

      expect(deletedArticle.statusCode).toBe(200);

      const result = await request(app)
        .get('/api/v1/feed/articles')
        .set('token', authToken);

      expect(deletedArticle.statusCode).toBe(200);
    });
  });

  describe('should connect to gifs table in database', () => {
    it('should retrieve all gifs from the database', async () => {
      const result = await request(app)
        .get('/api/v1/feed/gifs')
        .set('token', authToken);

      expect(result.statusCode).toBe(200);
      expect(result.body.data).toHaveProperty('id');
      expect(result.body.data).toHaveProperty('title');
      expect(result.body.data).toHaveProperty('image_url');
    });

    it('should get a single gifs from the database', async () => {
      const id = 7;
      const result = await request(app)
        .get(`/api/v1/gifs/${id}`)
        .set('token', authToken);

      expect(result.statusCode).toBe(200);
    });

    it('should delete a single gifs from the database', async () => {
      const id = 1;
      const result = await request(app)
        .delete(`/api/v1/gifs/${id}`)
        .set('token', authToken);

      if (result.body.data === undefined) {
        expect(result.body.status).toBe('Error');
      }

      expect(result.status).toBe(200);
    });
  });

  describe('should connect to employee table in database', () => {
    it('should create a new user', async () => {
      const user = {
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'janedoe@mymail.com',
        password: 'janedoe',
        gender: 'Female',
        job_role: 'Analyst',
        department: 'Sports',
        address: 'Kaduna'
      };

      const newUser = await request(app)
        .post('/api/v1/auth/create-user')
        .send(user);

      expect(newUser.body.error).toBe('You cannot perform this task');
    });
  });

  describe('should connect to comments table in database', () => {
    it('should post an article comment', async () => {
      const comment = {
        comment: 'This is a good article'
      };

      const articleId = 1;

      const newComment = await request(app)
        .post(`/api/v1/articles/${articleId}/comments`)
        .set('token', authToken)
        .send(comment);

      expect(newComment.statusCode).toBe(201);
    });

    it('should post a gif comment', async () => {
      const gifComment = {
        comment: 'This is a good gif'
      };

      const gifId = 1;

      const newGifComment = await request(app)
        .post(`/api/v1/gifs/${gifId}/comments`)
        .set('token', authToken)
        .send(gifComment);

      expect(newGifComment.statusCode).toBe(201);
    });
  });
});
