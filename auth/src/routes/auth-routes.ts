import { body } from 'express-validator';
import express from 'express';
import mongoose from 'mongoose';

import { signUp, login, requestPasswordReset, resetPassword } from '../controllers/auth-controllers';

const router = express.Router();

router.post('/sign-up', [
    body('username').trim().not().isEmpty(),
    body('email').normalizeEmail().isEmail(),
    body('password').trim().isLength({ min: 6 }),
    body('section').not().isEmpty().custom(input=>mongoose.Types.ObjectId.isValid(input))
], signUp);

router.post('/login', [
    body('email').normalizeEmail().isEmail(),
    body('password').trim().isLength({ min: 6 })
], login);

router.patch('/request-reset-token', [
    body('email').normalizeEmail().isEmail()
], requestPasswordReset);

router.patch('/reset-password/:resetToken', [
    body('password').trim().isLength({ min: 6 })
], resetPassword);

export { router as authRouter };