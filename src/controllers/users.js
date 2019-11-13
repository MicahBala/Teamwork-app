/* eslint-disable camelcase */
import Joi from 'joi';
import pool from '../db_connect';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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
    const checkQuery = 'SELECT * FROM employee WHERE email=$1';
    const checkResult = await pool.query(checkQuery, [email]);

    if (checkResult.rows[0]) {
      throw new Error(`User already exist with this email ${email}`);
    }
    const hashed = bcrypt.hashSync(password, bcrypt.genSaltSync(8));
    const newUserQuery =
      'INSERT INTO employee (first_name, last_name, email, password, gender, job_role, department, address) values ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
    const result = await pool.query(newUserQuery, [
      first_name,
      last_name,
      email,
      hashed,
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
    res.status(400);
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
    const loginQuery = 'SELECT * FROM employee WHERE email=$1';
    const result = await pool.query(loginQuery, [email]);

    if (result.rows[0] === undefined) {
      console.log(result.rows[0]);
      throw new Error('User doesnt exist or wrong login crdentials');
    }

    const isValidPassword = bcrypt.compareSync(
      password,
      result.rows[0].password
    );

    if (!isValidPassword) {
      throw new Error('Incorrect password');
    }

    const payload = { userId: result.rows[0].id };
    const secret = 'my_secrete_key';
    const options = { expiresIn: '24hr' };

    const token = jwt.sign(payload, secret, options);
    console.log(token);

    res.status(200);
    res.send({
      status: 'Success',
      data: {
        token: token,
        userId: result.rows[0].id
      }
    });
  } catch (err) {
    res.status(400);
    res.send({
      status: 'Error',
      error: err.message
    });
  }
}
