import { Router } from 'express';
import problemController from '../controllers/problem.controller';
import { validate } from '../middleware/validator';
import { createProblemSchema, updateProblemSchema } from '../validators';
import { authenticate } from '../middleware/authenticate';

const router = Router();

// Problem CRUD
router.post('/', authenticate, validate(createProblemSchema), problemController.createProblem);
router.get('/', problemController.getAllProblems);
router.get('/difficulty/:difficulty', problemController.getProblemsByDifficulty);
router.get('/tag/:tag', problemController.getProblemsByTag);
router.get('/creator/:userId', problemController.getProblemsByCreator);
router.get('/:id', problemController.getProblemById);
router.put('/:id', authenticate, validate(updateProblemSchema), problemController.updateProblem);
router.delete('/:id', authenticate, problemController.deleteProblem);

export default router;
