import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'my_secrete_key');
    const userId = decodedToken.userId;

    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid ID';
    } else {
      next();
    }
  } catch (error) {
    res.status(401);
    res.send({
      status: 'Error',
      error: 'Invalid request!'
    });
  }
};

export default auth;
