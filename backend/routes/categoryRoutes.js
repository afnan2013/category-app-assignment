import express from 'express';
const router = express.Router();

import {
  getAllCategories,
  getCategoryById,
  addCategory,
} from '../controllers/categoryControllers.js';
import { protect } from '../middlwares/authMiddeware.js';

router.route('/').get(getAllCategories).post(protect, addCategory);
router.route('/:id').get(getCategoryById);

export default router;
