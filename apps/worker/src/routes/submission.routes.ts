import { Router } from 'express';
import { createSubmissionSchema, updateSubmissionStatusSchema } from '../validators/index.js';
import submissionController from '../controllers/submission.controller.js';
import { validate } from '../middleware/validator.js';

const router = Router();

// Submission CRUD
router.post('/', validate(createSubmissionSchema), submissionController.createSubmission);
router.get('/', submissionController.getAllSubmissions);
router.get('/user/:userId', submissionController.getSubmissionsByUser);
router.get('/problem/:problemId', submissionController.getSubmissionsByProblem);
router.get('/user/:userId/problem/:problemId', submissionController.getSubmissionsByUserAndProblem);
router.get('/stats/user/:userId', submissionController.getUserStats);
router.get('/stats/problem/:problemId', submissionController.getProblemStats);
router.get('/:id', submissionController.getSubmissionById);
router.patch('/:id/status', validate(updateSubmissionStatusSchema), submissionController.updateSubmissionStatus);
router.delete('/:id', submissionController.deleteSubmission);

export default router;
