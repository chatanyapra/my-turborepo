import { Request, Response } from 'express';
import problemService from '../services/problem.service';
import { asyncHandler, AppError } from '../middleware/errorHandler';

interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

class ProblemController {
  createProblem = asyncHandler(async (req: AuthRequest, res: Response) => {
    // Extract user ID from JWT token
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    // Transform frontend format to backend format
    const { test_cases, time_limit, memory_limit, ...rest } = req.body;
    
    // Convert test cases from frontend format to backend format
    const testCases = test_cases.map((tc: any) => ({
      input: tc.input,
      expectedOutput: tc.expected_output,
      hidden: false, // Default to not hidden
    }));

    const problemData = {
      ...rest,
      testCases,
      timeLimit: time_limit || 1,
      memoryLimit: memory_limit || 128,
      createdBy: userId,
    };

    const problem = await problemService.createProblem(problemData);
    
    res.status(201).json({
      success: true,
      message: 'Problem created successfully',
      id: problem.id,
      problemId: problem.id,
    });
  });

  getProblemById = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const includeHidden = req.query.includeHidden === 'true';
    const problem = await problemService.getProblemById(id, includeHidden);

    if (!problem) {
      throw new AppError('Problem not found', 404);
    }

    res.status(200).json({
      success: true,
      data: problem,
    });
  });

  getAllProblems = asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const problems = await problemService.getAllProblems(limit, offset);
    const total = await problemService.getProblemCount();

    res.status(200).json({
      success: true,
      data: problems,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  });

  getProblemsByDifficulty = asyncHandler(async (req: Request, res: Response) => {
    const { difficulty } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const problems = await problemService.getProblemsByDifficulty(difficulty, limit, offset);
    const total = await problemService.getProblemCountByDifficulty(difficulty);

    res.status(200).json({
      success: true,
      data: problems,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  });

  getProblemsByTag = asyncHandler(async (req: Request, res: Response) => {
    const { tag } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const problems = await problemService.getProblemsByTag(tag, limit, offset);

    res.status(200).json({
      success: true,
      data: problems,
    });
  });

  getProblemsByCreator = asyncHandler(async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const problems = await problemService.getProblemsByCreator(userId, limit, offset);

    res.status(200).json({
      success: true,
      data: problems,
    });
  });

  updateProblem = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const problem = await problemService.updateProblem(id, req.body);

    res.status(200).json({
      success: true,
      message: 'Problem updated successfully',
      data: problem,
    });
  });

  deleteProblem = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const deleted = await problemService.deleteProblem(id);

    if (!deleted) {
      throw new AppError('Problem not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Problem deleted successfully',
    });
  });
}

export default new ProblemController();
