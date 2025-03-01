import express from 'express';
import { body, param, validationResult } from 'express-validator';
import {
  loginControllers,
  registerControllers,
  setAvatarController,
  deleteUsersController,
  getTransactionDetailController,
} from '../controllers/userController.js';

const router = express.Router();

// Validation middleware
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array() });
  };
};

// Register route with validation
router.route('/register').post(
  validate([
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ]),
  registerControllers
);

// Login route with validation
router.route('/login').post(
  validate([
    body('email').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ]),
  loginControllers
);

// Set avatar route with validation
router.route('/setAvatar/:id').post(
  validate([
    param('id').notEmpty().withMessage('User ID is required'),
    body('avatar').notEmpty().withMessage('Avatar URL is required'),
  ]),
  setAvatarController
);

// New route: Delete multiple users
router.route('/deleteUsers').post(
  validate([
    body('userIds').isArray({ min: 1 }).withMessage('At least one user ID is required'),
  ]),
  deleteUsersController
);

// New route: Fetch single transaction detail
router.route('/transaction/:id').get(
  validate([
    param('id').notEmpty().withMessage('Transaction ID is required'),
  ]),
  getTransactionDetailController
);

export default router;