import { z } from 'zod';

// User Validators
export const createUserSchema = z.object({
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  profileImage: z.string().url().optional(),
  role: z.enum(['user', 'admin', 'moderator']).optional(),
});

export const updateUserSchema = z.object({
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_]+$/).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  profileImage: z.string().url().optional(),
  role: z.enum(['user', 'admin', 'moderator']).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

// Problem Validators
const exampleSchema = z.object({
  input: z.string().min(1, 'Input is required'),
  output: z.string().min(1, 'Output is required'),
  explanation: z.string().optional(),
  image: z.string().url().optional().or(z.literal('')),
});

const testCaseSchema = z.object({
  input: z.string().min(1, 'Input is required'),
  expected_output: z.string().min(1, 'Expected output is required'),
});

export const createProblemSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  constraints: z.string().min(1, 'Constraints are required'),
  examples: z.array(exampleSchema).min(1, 'At least one example is required'),
  test_cases: z.array(testCaseSchema).min(1, 'At least one test case is required'),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  time_limit: z.number().int().positive().default(1),
  memory_limit: z.number().int().positive().default(128),
});

export const updateProblemSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().min(1).optional(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).optional(),
  constraints: z.string().optional(),
  examples: z.array(exampleSchema).optional(),
  testCases: z.array(testCaseSchema).optional(),
  tags: z.array(z.string()).optional(),
  timeLimit: z.number().int().positive().optional(),
  memoryLimit: z.number().int().positive().optional(),
});

// Submission Validators
export const createSubmissionSchema = z.object({
  userId: z.number().int().positive(),
  problemId: z.number().int().positive(),
  code: z.string().min(1, 'Code cannot be empty'),
  language: z.string().min(1, 'Language is required'),
});

export const updateSubmissionStatusSchema = z.object({
  status: z.string().min(1),
  runtime: z.number().int().optional(),
  memory: z.number().int().optional(),
});
