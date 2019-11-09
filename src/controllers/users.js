/* eslint-disable camelcase */
import Joi from 'joi';
import pool from '../db_connect';

// Signin a user
export async function signinUser(req, res, next) {
  const { email, password } = req.body;
  const schema = {
    email: Joi.string().required(),
    password: Joi.string().required()
  };
  const validatedInput = Joi.validate(req.body, schema);
  if (validatedInput.error) {
    res.status(400).send({
      status: 'error',
      error: validatedInput.error.details[0].message
    });
    return;
  }
  try {
    const loginQuery = 'SELECT * FROM employee WHERE email=$1 AND password=$2';
    const result = await pool.query(loginQuery, [email, password]);
    res.status(200);
    // console.log(result.rows);
    res.send({
      status: 'Success',
      data: {
        token: 'Token',
        userId: result.rows[0].id
      }
    });
  } catch (err) {
    res.send({
      status: 'Error',
      error: err.message
    });
  }
}
