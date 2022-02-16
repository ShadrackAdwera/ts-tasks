import { checkAuth } from '@adwesh/common';
import { body } from 'express-validator';
import express from 'express';

import { createCategory, getCategories, getCategoryById, updateCategory } from '../controllers/category-controllers';

const router = express.Router();

router.use(checkAuth);
router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.post('/new', [
    body('title').trim().not().isEmpty(),
    body('description').trim().not().isEmpty(),
    body('priority').trim().not().isEmpty(),
], createCategory);
router.patch('/:id', [
    body('title').trim().not().isEmpty(),
    body('description').trim().not().isEmpty(),
    body('priority').trim().not().isEmpty(),
], updateCategory);
