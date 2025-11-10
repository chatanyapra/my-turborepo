import { Router } from 'express';
import problemCodeController from '../controllers/problemCode.controller';
import { validate } from '../middleware/validator';
import { createProblemCodeSchema, updateProblemCodeSchema } from '../validators';
import { authenticate } from '../middleware/authenticate';
import { requireAdmin } from '../middleware/adminAuth';

const router = Router();

// ProblemCode CRUD (Admin only)
router.post(
  '/',
  authenticate,
  requireAdmin,
  validate(createProblemCodeSchema),
  problemCodeController.createProblemCode
);

router.post(
  '/upsert',
  authenticate,
  requireAdmin,
  validate(createProblemCodeSchema),
  problemCodeController.upsertProblemCode
);

router.get('/:problemId', problemCodeController.getAllProblemCodes);

router.get('/:problemId/:language', problemCodeController.getProblemCodeByLanguage);

router.put(
  '/:problemId/:language',
  authenticate,
  requireAdmin,
  validate(updateProblemCodeSchema),
  problemCodeController.updateProblemCode
);

router.delete(
  '/:problemId/:language',
  authenticate,
  requireAdmin,
  problemCodeController.deleteProblemCode
);

export default router;
