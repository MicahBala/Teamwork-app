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
    try {
      // await pool.query(
      //   'CREATE TABLE employee (id BIGSERIAL NOT NULL PRIMARY KEY, first_name VARCHAR(50) NOT NULL, last_name VARCHAR(50) NOT NULL, email VARCHAR(50) NOT NULL, password VARCHAR(50) NOT NULL, gender VARCHAR(50) NOT NULL, job_role VARCHAR(50) NOT NULL, department VARCHAR(50) NOT NULL, is_admin BOOLEAN, address TEXT)'
      // );
      // await pool.query(
      //   'CREATE TABLE comments (id BIGSERIAL NOT NULL PRIMARY KEY, comments TEXT, created_on DATE)'
      // );
      await pool.query(
        'CREATE TABLE articles_table (id BIGSERIAL NOT NULL PRIMARY KEY, title VARCHAR(50), article TEXT, created_on DATE)'
      );
      // await pool.query(
      //   'CREATE TABLE gif_table (id BIGSERIAL NOT NULL PRIMARY KEY, image_url TEXT, title TEXT, created_on DATE'
      // );
    } catch (error) {
      console.log(error);
    }
  });
  beforeEach(async () => {
    try {
      // await pool.query(
      //   "INSERT INTO employee (first_name, last_name, email, password, gender, job_role, department, is_admin, address) values ('John', 'Doe', 'johndoe@mymail.com', 'biSukiE', 'Female', 'Analyst', 'Sports','true','Kaduna');"
      // );
      // await pool.query(
      //   "INSERT INTO comments (comments, created_on) values ('Very good piece...!','2019-09-21')"
      // );
      await pool.query(
        "INSERT INTO articles_table (title, article, created_on) values ('Blue Swallow (Cheong yeon)', 'In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum.', '2019-09-21')"
      );
      // await pool.query(
      //   "INSERT INTO gif_table (image_url, title, created_on) values ('http://dummyimage.com/248x140.png/5fa2dd/ffffff', 'The End of the Tour', '2019-03-05')"
      // );
    } catch (error) {
      console.log(error);
    }
  });
  afterEach(async () => {
    await pool.query('DELETE FROM articles_table');
    // await pool.query('DELETE FROM gif_table');
    // await pool.query('DELETE FROM comments');
    // await pool.query('DELETE FROM employee');
  });
  afterAll(async () => {
    await pool.query('DROP TABLE articles_table');
    // await pool.query('DROP TABLE gif_table');
    // await pool.query('DROP TABLE comments');
    // await pool.query('DROP TABLE employee');
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
        created_on: new Date()
      };
      const article = await request(app)
        .post('/api/v1/articles')
        .send(newArticle);
      console.log(article.body.data);
      // expect(article.body.data.title).toBe('My New Book');
      // expect(article.body.data.owner_id).toBe('2');
      // expect(article.statusCode).toBe(201);
      // const result = await request(app).get('/api/v1/feed/articles');
      // expect(result.body.data.length).toBe(2);
    });
    //   it('should retrieve one article from database', async () => {
    //     const newArticle = {
    //       title: 'My New Book',
    //       article: 'lorem. Integer tincidunt ante vel ipsum.',
    //       created_on: '2019-11-02',
    //       owner_id: 2
    //     };
    //     const article = await request(app)
    //       .post('/api/v1/articles')
    //       .send(newArticle);
    //     expect(article.body.data.title).toBe('My New Book');
    //     expect(article.body.data.owner_id).toBe('2');
    //     expect(article.statusCode).toBe(201);
    //     const result = await request(app).get(
    //       `/api/v1/articles/${article.body.data.articleId}`
    //     );
    //     expect(result.body.data).toHaveProperty('id');
    //     expect(result.body.data.id).toBe(`${article.body.data.articleId}`);
    //     expect(result.body.data).toHaveProperty('title');
    //     expect(result.statusCode).toBe(200);
    //   });
    //   it('should update an article in the database', async () => {
    //     const newArticle = {
    //       title: 'My New Book',
    //       article: 'lorem. Integer tincidunt ante vel ipsum.',
    //       created_on: '2019-11-02',
    //       owner_id: 2
    //     };
    //     const article = await request(app)
    //       .post('/api/v1/articles')
    //       .send(newArticle);
    //     expect(article.body.data.title).toBe('My New Book');
    //     expect(article.body.data.owner_id).toBe('2');
    //     expect(article.statusCode).toBe(201);
    //     const id = parseInt(article.body.data.articleId, 10);
    //     const result = await request(app)
    //       .patch(`/api/v1/articles/${id}`)
    //       .send({
    //         title: 'Updated Article'
    //       });
    //     expect(result.body.data.title).toBe('Updated Article');
    //   });
    //   it('should delete an article from the database', async () => {
    //     const newArticle = {
    //       title: 'My New Book',
    //       article: 'lorem. Integer tincidunt ante vel ipsum.',
    //       created_on: '2019-11-02',
    //       owner_id: 2
    //     };
    //     const article = await request(app)
    //       .post('/api/v1/articles')
    //       .send(newArticle);
    //     expect(article.body.data.title).toBe('My New Book');
    //     expect(article.body.data.owner_id).toBe('2');
    //     expect(article.statusCode).toBe(201);
    //     const id = parseInt(article.body.data.articleId, 10);
    //     const deletedArticle = await request(app).delete(
    //       `/api/v1/articles/${id}`
    //     );
    //     expect(deletedArticle.statusCode).toBe(200);
    //     const result = await request(app).get('/api/v1/feed/articles');
    //     expect(result.body.data.length).toBe(1);
    //   });
    // });
    // describe('should connect to gifs table in database', () => {
    //   it('should retrieve all gifs from the database', async () => {
    //     const result = await request(app).get('/api/v1/feed/gifs');
    //     expect(result.statusCode).toBe(200);
    //     expect(result.body.data.length).toBe(1);
    //     expect(result.body.data[0]).toHaveProperty('id');
    //     expect(result.body.data[0]).toHaveProperty('title');
    //     expect(result.body.data[0]).toHaveProperty('image_url');
    //   });
    //   it('should post a new gif to database', async () => {
    //     const newGif = {
    //       image_url: 'http://mynewgifaddress.com',
    //       title: 'My New Image',
    //       created_on: '2019-11-02',
    //       owner_id: 1
    //     };
    //     const gif = await request(app)
    //       .post('/api/v1/gifs/')
    //       .send(newGif);
    //     expect(gif.body.data.title).toBe('My New Image');
    //     expect(gif.statusCode).toBe(201);
    //     const result = await request(app).get('/api/v1/feed/gifs');
    //     expect(result.body.data.length).toBe(2);
    //   });
    //   it('should retrieve a single gif from database', async () => {
    //     const newGif = {
    //       image_url: 'http://mynewgifaddress.com',
    //       title: 'My New Image',
    //       created_on: '2019-11-02',
    //       owner_id: 1
    //     };
    //     const gif = await request(app)
    //       .post('/api/v1/gifs')
    //       .send(newGif);
    //     expect(gif.body.data.title).toBe('My New Image');
    //     expect(gif.statusCode).toBe(201);
    //     const result = await request(app).get(
    //       `/api/v1/gifs/${gif.body.data.gifId}`
    //     );
    //     expect(result.body.data).toHaveProperty('id');
    //     expect(result.body.data.id).toBe(`${gif.body.data.gifId}`);
    //     expect(result.body.data).toHaveProperty('title');
    //     expect(result.statusCode).toBe(200);
    //   });
    //   it('should delete a gif from database', async () => {
    //     const newGif = {
    //       image_url: 'http://mynewgifaddress.com',
    //       title: 'My New Image',
    //       created_on: '2019-11-02',
    //       owner_id: 1
    //     };
    //     const gif = await request(app)
    //       .post('/api/v1/gifs')
    //       .send(newGif);
    //     expect(gif.body.data.title).toBe('My New Image');
    //     expect(gif.statusCode).toBe(201);
    //     const id = parseInt(gif.body.data.gifId, 10);
    //     const deletedGif = await request(app).delete(`/api/v1/gifs/${id}`);
    //     expect(deletedGif.statusCode).toBe(200);
    //     const result = await request(app).get('/api/v1/feed/gifs');
    //     expect(result.body.data.length).toBe(1);
    //   });
    // });
    // describe('should connect to employees table in databse', () => {
    //   it('should create a user successfully', async () => {
    //     const newUser = {
    //       first_name: 'John',
    //       last_name: 'Doe',
    //       email: 'johndoe@mymail.com',
    //       password: 'johndoe',
    //       gender: 'Male',
    //       job_role: 'Accountant',
    //       department: 'Accounts',
    //       is_admin: 'false',
    //       address: 'Kaduna'
    //     };
    //     const user = await request(app)
    //       .post('/api/v1/auth/create-user')
    //       .send(newUser);
    //     expect(user.statusCode).toBe(201);
    //   });
    //   it('should signin a user successfully', async () => {
    //     const newUser = {
    //       first_name: 'John',
    //       last_name: 'Doe',
    //       email: 'johndoe@mymail.com',
    //       password: 'johndoe',
    //       gender: 'Male',
    //       job_role: 'Accountant',
    //       department: 'Accounts',
    //       is_admin: 'false',
    //       address: 'Kaduna'
    //     };
    //     const user = await request(app)
    //       .post('/api/v1/auth/create-user')
    //       .send(newUser);
    //     expect(user.statusCode).toBe(201);
    //     const result = await request(app)
    //       .post('/api/v1/auth/signin')
    //       .send({ email: 'johndoe@mymail.com', password: 'johndoe' });
    //     expect(result.status).toBe(200);
    //   });
  });
});
