import axios from 'axios';
import type { ProblemFormData, Problem, ProblemListItem } from '../types';

const API_BASE_URL = 'http://localhost:3000/api';

interface ProblemSubmissionResponse {
  success: boolean;
  message: string;
  problemId?: number;
  error?: string;
}

/**
 * Submit a new coding problem to the database
 * @param problemData - The problem form data
 * @param token - JWT authentication token
 * @returns Promise with submission response
 */
export const submitProblem = async (
  problemData: ProblemFormData,
  token: string
): Promise<ProblemSubmissionResponse> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/problems`,
      problemData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      success: true,
      message: response.data.message || 'Problem submitted successfully!',
      problemId: response.data.id || response.data.problemId,
    };
  } catch (error: any) {
    console.error('Error submitting problem:', error);

    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to submit problem. Please try again.';

      return {
        success: false,
        message: errorMessage,
        error: errorMessage,
      };
    }

    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
      error: error.message,
    };
  }
};

/**
 * Get all problems with pagination
 * @param limit - Number of problems per page (default: 50)
 * @param offset - Offset for pagination (default: 0)
 * @returns Promise with problems list
 */
export const getAllProblems = async (
  limit: number = 50,
  offset: number = 0
): Promise<{ success: boolean; data?: ProblemListItem[]; total?: number; error?: string }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/problems`, {
      params: { limit, offset },
    });

    // Transform backend data to frontend format
    const problems: ProblemListItem[] = response.data.data.map((p: any) => ({
      id: p.id,
      title: p.title,
      difficulty: p.difficulty,
      tags: p.tags || [],
      acceptance: 0, // TODO: Calculate from submissions
      solved: false, // TODO: Check user submissions
    }));

    return {
      success: true,
      data: problems,
      total: response.data.pagination?.total || problems.length,
    };
  } catch (error: any) {
    console.error('Error fetching problems:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch problems',
    };
  }
};

/**
 * Get a single problem by ID
 * @param id - Problem ID
 * @returns Promise with problem data
 */
export const getProblemById = async (
  id: number
): Promise<{ success: boolean; data?: Problem; error?: string }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/problems/${id}`);

    // Transform backend data to frontend format
    const problem: Problem = {
      id: response.data.data.id,
      title: response.data.data.title,
      description: response.data.data.description,
      difficulty: response.data.data.difficulty,
      constraints: response.data.data.constraints || '',
      examples: response.data.data.examples || [],
      testCases: response.data.data.testCases || [],
      tags: response.data.data.tags || [],
      timeLimit: response.data.data.timeLimit || 1,
      memoryLimit: response.data.data.memoryLimit || 128,
      createdBy: response.data.data.createdBy,
      createdAt: response.data.data.createdAt,
      updatedAt: response.data.data.updatedAt,
    };

    return {
      success: true,
      data: problem,
    };
  } catch (error: any) {
    console.error('Error fetching problem:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch problem',
    };
  }
};

/**
 * Update an existing problem (admin only)
 * @param id - Problem ID
 * @param problemData - The updated problem form data
 * @param token - JWT authentication token
 * @returns Promise with update response
 */
export const updateProblem = async (
  id: number,
  problemData: ProblemFormData,
  token: string
): Promise<ProblemSubmissionResponse> => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/problems/${id}`,
      problemData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      success: true,
      message: response.data.message || 'Problem updated successfully!',
      problemId: response.data.data?.id || id,
    };
  } catch (error: any) {
    console.error('Error updating problem:', error);

    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to update problem. Please try again.';

      return {
        success: false,
        message: errorMessage,
        error: errorMessage,
      };
    }

    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
      error: error.message,
    };
  }
};
