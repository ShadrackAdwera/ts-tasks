import { body } from 'express-validator';
import { checkAuth } from '@adwesh/common';
import express from 'express';

import { getSections, newSection } from '../controllers/section-controllers';

const router = express.Router();

router.use(checkAuth);
router.get('/',)