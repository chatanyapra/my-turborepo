import { Request, Response } from 'express';
import userService from '../services/user.service';
import { asyncHandler, AppError } from '../middleware/errorHandler';

class UserController {
  createUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.createUser(req.body);
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user,
    });
  });

  getUserById = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const user = await userService.getUserById(id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  });

  getUserByEmail = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.query;
    const user = await userService.getUserByEmail(email as string);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  });

  getUserByUsername = asyncHandler(async (req: Request, res: Response) => {
    const { username } = req.query;
    const user = await userService.getUserByUsername(username as string);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  });

  getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const users = await userService.getAllUsers(limit, offset);
    const total = await userService.getUserCount();

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  });

  updateUser = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const user = await userService.updateUser(id, req.body);

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  });

  deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const deleted = await userService.deleteUser(id);

    if (!deleted) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await userService.verifyPassword(email, password);

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: user,
    });
  });
}

export default new UserController();
