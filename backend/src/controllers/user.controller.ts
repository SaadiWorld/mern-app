import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

import HttpError from '../utils/http-error';

const dummyUsers = [
  {
    id: 'u1',
    name: 'Walter White',
    email: 'walter.white@breakingbad.com',
    password: 'heisenberg'
  }
];

const getUsers = (_req: Request, res: Response, _next: NextFunction): void => {
  res.json({ users: dummyUsers });
};

const signup = (req: Request, res: Response, _next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid inputs passed, please check your data.', 422);
  }
  const { name, email, password } = req.body;

  const hasUser = dummyUsers.find(u => u.email === email);
  if (hasUser) {
    throw new HttpError('Could not create user, email already exists.', 422);
  }

  const createdUser = {
    id: randomUUID(),
    name, // name: name
    email,
    password
  };

  dummyUsers.push(createdUser);

  res.status(201).json({user: createdUser});
};

const login = (req: Request, res: Response, _next: NextFunction): void => {
  const { email, password } = req.body;

  const identifiedUser = dummyUsers.find(u => u.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError('Could not identify user, credentials seem to be wrong.', 401);
  }

  res.json({message: 'Logged in!'});
};

export default { getUsers, signup, login };