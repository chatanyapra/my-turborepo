import axios from 'axios';
import type { ProblemFormData } from '../types';

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
 * Get all problems (for admin/listing purposes)
 * @param token - JWT authentication token
 * @returns Promise with problems list
 */
export const getAllProblems = async (token: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/problems`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      success: true,
      data: response.data,
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
 * @param token - JWT authentication token
 * @returns Promise with problem data
 */
export const getProblemById = async (id: number, token: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/problems/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error('Error fetching problem:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch problem',
    };
  }
};
