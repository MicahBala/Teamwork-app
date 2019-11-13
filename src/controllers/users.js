/* eslint-disable camelcase */
import Joi from 'joi';
import pool from '../db_connect';

// Create a user
export async function createUser(req, res, next) {
  const {
    first_name,
    last_name,
    email,
    password,
    gender,
    job_role,
    department,
    address
  } = req.body;

  const schema = {
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    gender: Joi.string().required(),
    job_role: Joi.string().required(),
    department: Joi.string().required(),
    address: Joi.string().required()
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
    const newUserQuery =
      'INSERT INTO employee (first_name, last_name, email, password, gender, job_role, department, address) values ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
    const result = await pool.query(newUserQuery, [
      first_name,
      last_name,
      email,
      password,
      gender,
      job_role,
      department,
      address
    ]);

    res.status(201);
    res.send({
      status: 'User account created successfully',
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

    if (result.rows[0] === undefined) {
      throw new Error('User doesnt exist or wrong login crdentials');
    }

    res.status(200);
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
