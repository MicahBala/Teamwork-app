// it('should post an article to the database', async () => {
//   const newArticle = {
//     title: 'My New Book',
//     article: 'lorem. Integer tincidunt ante vel ipsum.',
//     created_on: '2019-11-02',
//     owner_id: 2
//   };
//   const article = await request(app)
//     .post('/api/v1/articles')
//     .send(newArticle);
//   expect(article.body.data.title).toBe('My New Book');
//   expect(article.body.data.owner_id).toBe('2');
//   expect(article.statusCode).toBe(201);
//   const result = await request(app).get('/api/v1/feed/articles');
//   expect(result.body.data.length).toBe(2);
// });
// it('should retrieve one article from database', async () => {
//   const newArticle = {
//     title: 'My New Book',
//     article: 'lorem. Integer tincidunt ante vel ipsum.',
//     created_on: '2019-11-02',
//     owner_id: 2
//   };
//   const article = await request(app)
//     .post('/api/v1/articles')
//     .send(newArticle);
//   expect(article.body.data.title).toBe('My New Book');
//   expect(article.body.data.owner_id).toBe('2');
//   expect(article.statusCode).toBe(201);
//   const result = await request(app).get(
//     `/api/v1/articles/${article.body.data.articleId}`
//   );
//   expect(result.body.data).toHaveProperty('id');
//   expect(result.body.data.id).toBe(`${article.body.data.articleId}`);
//   expect(result.body.data).toHaveProperty('title');
//   expect(result.statusCode).toBe(200);
// });
// it('should update an article in the database', async () => {
//   const newArticle = {
//     title: 'My New Book',
//     article: 'lorem. Integer tincidunt ante vel ipsum.',
//     created_on: '2019-11-02',
//     owner_id: 2
//   };
//   const article = await request(app)
//     .post('/api/v1/articles')
//     .send(newArticle);
//   expect(article.body.data.title).toBe('My New Book');
//   expect(article.body.data.owner_id).toBe('2');
//   expect(article.statusCode).toBe(201);
//   const id = parseInt(article.body.data.articleId, 10);
//   const result = await request(app)
//     .patch(`/api/v1/articles/${id}`)
//     .send({
//       title: 'Updated Article'
//     });
//   expect(result.body.data.title).toBe('Updated Article');
// });
// it('should delete an article from the database', async () => {
// const newArticle = {
//   title: 'My New Book',
//   article: 'lorem. Integer tincidunt ante vel ipsum.',
//   created_on: '2019-11-02',
//   owner_id: 2
// };
// const article = await request(app)
//   .post('/api/v1/articles')
//   .send(newArticle);
//   console.log(article.body.data);
// expect(article.body.data.title).toBe('My New Book');
// expect(article.body.data.owner_id).toBe('2');
// expect(article.statusCode).toBe(201);
// const id = parseInt(article.body.data.articleId, 10);
// const deletedArticle = await request(app).delete(
//   `/api/v1/articles/${id}`
// );
// expect(deletedArticle.statusCode).toBe(200);
// const result = await request(app).get('/api/v1/feed/articles');
// expect(result.body.data.length).toBe(1);
// });
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
