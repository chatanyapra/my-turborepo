import { Request, Response } from 'express';
import problemCodeService from '../services/problemCode.service';
import { asyncHandler, AppError } from '../middleware/errorHandler';

interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role?: string;
  };
}

class ProblemCodeController {
  createProblemCode = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { problemId, language, wrapperCode, boilerplateCode } = req.body;

    const problemCode = await problemCodeService.createProblemCode({
      problemId,
      language,
      wrapperCode,
      boilerplateCode,
    });

    res.status(201).json({
      success: true,
      message: 'Problem code created successfully',
      data: problemCode,
    });
  });

  upsertProblemCode = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { problemId, language, wrapperCode, boilerplateCode } = req.body;

    const problemCode = await problemCodeService.upsertProblemCode({
      problemId,
      language,
      wrapperCode,
      boilerplateCode,
    });

    res.status(200).json({
      success: true,
      message: 'Problem code saved successfully',
      data: problemCode,
    });
  });

  getProblemCodeByLanguage = asyncHandler(async (req: Request, res: Response) => {
    const problemId = parseInt(req.params.problemId);
    const { language } = req.params;

    const problemCode = await problemCodeService.getProblemCodeByLanguage(problemId, language);

    if (!problemCode) {
      throw new AppError('Problem code not found', 404);
    }

    res.status(200).json({
      success: true,
      data: problemCode,
    });
  });

  getAllProblemCodes = asyncHandler(async (req: Request, res: Response) => {
    const problemId = parseInt(req.params.problemId);

    const problemCodes = await problemCodeService.getAllProblemCodes(problemId);

    res.status(200).json({
      success: true,
      data: problemCodes,
    });
  });

  updateProblemCode = asyncHandler(async (req: Request, res: Response) => {
    const problemId = parseInt(req.params.problemId);
    const { language } = req.params;
    const { wrapperCode, boilerplateCode } = req.body;

    const problemCode = await problemCodeService.updateProblemCode(problemId, language, {
      wrapperCode,
      boilerplateCode,
    });

    res.status(200).json({
      success: true,
      message: 'Problem code updated successfully',
      data: problemCode,
    });
  });

  deleteProblemCode = asyncHandler(async (req: Request, res: Response) => {
    const problemId = parseInt(req.params.problemId);
    const { language } = req.params;

    const deleted = await problemCodeService.deleteProblemCode(problemId, language);

    if (!deleted) {
      throw new AppError('Problem code not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Problem code deleted successfully',
    });
  });
}

export default new ProblemCodeController();
