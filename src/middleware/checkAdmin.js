import jwt from 'jsonwebtoken';

const checkAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'my_secrete_key');
    const userId = decodedToken.userId;

    if (userId != '14') {
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
