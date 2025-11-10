import { Router } from 'express';
import problemController from '../controllers/problem.controller';
import { validate } from '../middleware/validator';
import { createProblemSchema, updateProblemSchema } from '../validators';
import { authenticate } from '../middleware/authenticate';
import { requireAdmin } from '../middleware/adminAuth';

const router = Router();

// Problem CRUD
router.post('/', authenticate, requireAdmin, validate(createProblemSchema), problemController.createProblem);
router.get('/', problemController.getAllProblems);
router.get('/difficulty/:difficulty', problemController.getProblemsByDifficulty);
router.get('/tag/:tag', problemController.getProblemsByTag);
router.get('/creator/:userId', problemController.getProblemsByCreator);
router.get('/:id', problemController.getProblemById);
router.put('/:id', authenticate, requireAdmin, validate(updateProblemSchema), problemController.updateProblem);
router.delete('/:id', authenticate, requireAdmin, problemController.deleteProblem);

export default router;
