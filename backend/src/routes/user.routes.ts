import express from 'express';
import { check } from 'express-validator';

import userController from '../controllers/user.controller';
import fileUpload from '../middleware/file-upload';

const router = express.Router();

router.get('/', userController.getUsers);

router.post(
  '/',
  fileUpload.single('image'),
  [
    check('name').not().isEmpty(),
    check('email')
      .normalizeEmail() // Test@test.com => test@test.com
      .isEmail(),
    check('password').isLength({ min: 6 }),
  ],
  userController.signup,
);

router.post(
  '/sessions',
  [
    check('email').normalizeEmail().isEmail(),
    check('password').not().isEmpty(),
  ],
  userController.login,
);

export default router;
