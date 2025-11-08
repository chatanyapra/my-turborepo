// User Types
export interface CreateUserDTO {
  username: string;
  email: string;
  password: string;
  profileImage?: string;
  role?: string;
}

export interface UpdateUserDTO {
  username?: string;
  email?: string;
  password?: string;
  profileImage?: string;
  role?: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  profileImage?: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

// Problem Types
export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  hidden: boolean;
}

export interface CreateProblemDTO {
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  constraints?: string;
  examples: Example[];
  testCases: TestCase[];
  tags?: string[];
  timeLimit?: number;
  memoryLimit?: number;
  createdBy: number;
}

export interface UpdateProblemDTO {
  title?: string;
  description?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  constraints?: string;
  examples?: Example[];
  testCases?: TestCase[];
  tags?: string[];
  timeLimit?: number;
  memoryLimit?: number;
}

export interface ProblemResponse {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  constraints?: string | null;
  examples: Example[];
  testCases?: TestCase[];
  tags: string[];
  timeLimit: number;
  memoryLimit: number;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
}

// Submission Types
export type SubmissionStatus =
  | 'Pending'
  | 'Running'
  | 'Accepted'
  | 'Wrong Answer'
  | 'Time Limit Exceeded'
  | 'Memory Limit Exceeded'
  | 'Runtime Error'
  | 'Compilation Error';

export interface CreateSubmissionDTO {
  userId: number;
  problemId: number;
  code: string;
  language: string;
}

export interface SubmissionResponse {
  id: number;
  userId: number;
  problemId: number;
  code: string;
  language: string;
  status: string | null;
  runtime?: number | null;
  memory?: number | null;
  createdAt: Date;
}

export interface SubmissionStats {
  total: number;
  accepted: number;
  wrongAnswer: number;
  timeLimitExceeded: number;
  runtimeError: number;
  compilationError: number;
}
