import { Request, Response } from 'express';
import submissionService from '../services/submission.service';
import { asyncHandler, AppError } from '../middleware/errorHandler';

class SubmissionController {
  createSubmission = asyncHandler(async (req: Request, res: Response) => {
    const submission = await submissionService.createSubmission(req.body);
    res.status(201).json({
      success: true,
      message: 'Submission created successfully',
      data: submission,
    });
  });

  getSubmissionById = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const submission = await submissionService.getSubmissionById(id);

    if (!submission) {
      throw new AppError('Submission not found', 404);
    }

    res.status(200).json({
      success: true,
      data: submission,
    });
  });

  getSubmissionsByUser = asyncHandler(async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const submissions = await submissionService.getSubmissionsByUser(userId, limit, offset);

    res.status(200).json({
      success: true,
      data: submissions,
    });
  });

  getSubmissionsByProblem = asyncHandler(async (req: Request, res: Response) => {
    const problemId = parseInt(req.params.problemId);
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const submissions = await submissionService.getSubmissionsByProblem(problemId, limit, offset);

    res.status(200).json({
      success: true,
      data: submissions,
    });
  });

  getSubmissionsByUserAndProblem = asyncHandler(async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const problemId = parseInt(req.params.problemId);
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const submissions = await submissionService.getSubmissionsByUserAndProblem(userId, problemId, limit, offset);

    res.status(200).json({
      success: true,
      data: submissions,
    });
  });

  getAllSubmissions = asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const submissions = await submissionService.getAllSubmissions(limit, offset);
    const total = await submissionService.getSubmissionCount();

    res.status(200).json({
      success: true,
      data: submissions,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  });

  updateSubmissionStatus = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { status, runtime, memory } = req.body;

    const submission = await submissionService.updateSubmissionStatus(id, status, runtime, memory);

    res.status(200).json({
      success: true,
      message: 'Submission status updated successfully',
      data: submission,
    });
  });

  getUserStats = asyncHandler(async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const stats = await submissionService.getUserStats(userId);

    res.status(200).json({
      success: true,
      data: stats,
    });
  });

  getProblemStats = asyncHandler(async (req: Request, res: Response) => {
    const problemId = parseInt(req.params.problemId);
    const stats = await submissionService.getProblemStats(problemId);

    res.status(200).json({
      success: true,
      data: stats,
    });
  });

  deleteSubmission = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const deleted = await submissionService.deleteSubmission(id);

    if (!deleted) {
      throw new AppError('Submission not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Submission deleted successfully',
    });
  });
}

export default new SubmissionController();
