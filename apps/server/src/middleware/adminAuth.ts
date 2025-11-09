import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role?: string;
  };
}

/**
 * Middleware to check if the authenticated user has admin role
 * Must be used after authenticate middleware
 */
export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  const user = req.user;

  if (!user) {
    throw new AppError('Authentication required', 401);
  }

  if (user.role !== 'admin') {
    throw new AppError('Admin access required. You do not have permission to perform this action.', 403);
  }

  next();
};
