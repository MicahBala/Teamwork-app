import jwt from 'jsonwebtoken';
import { JWT_SECRETE_KEY } from 'babel-dotenv';

const checkAdmin = (req, res, next) => {
  try {
    const token = req.headers.token;
    const decodedToken = jwt.verify(token, JWT_SECRETE_KEY);
    const userId = decodedToken.userId;

    if (userId != '2') {
      throw 'Invalid ID';
    } else {
      next();
    }
  } catch (error) {
    res.status(401);
    res.send({
      status: 'Error',
      error: 'You cannot perform this task'
    });
  }
};

export default checkAdmin;
