import { checkAuth } from '@adwesh/common';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import express from 'express';

import { createTask, getAllTasks, getPendingTasks, updateTasksAssigned } from '../controllers/tasks-controllers';

const router = express.Router();

router.use(checkAuth);

router.get('/', getAllTasks);
router.get('/pending', getPendingTasks);
router.post('/new', [
    body('title').trim().not().isEmpty(),
    body('description').trim().not().isEmpty(),
    body('category').not().isEmpty().custom(item=>mongoose.Types.ObjectId.isValid(item))
] ,createTask);
router.patch('/:taskId', updateTasksAssigned);

export { router as tasksRouter };
