import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

export interface ProblemCodeData {
  problemId: number;
  language: string;
  wrapperCode: string;
  boilerplateCode: string;
}

export interface ProblemCodeResponse {
  id: number;
  problemId: number;
  language: string;
  wrapperCode: string;
  boilerplateCode: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

/**
 * Create or update problem code (upsert)
 */
export const upsertProblemCode = async (
  data: ProblemCodeData,
  token: string
): Promise<ApiResponse<ProblemCodeResponse>> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/problem-codes/upsert`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      success: true,
      message: response.data.message,
      data: response.data.data,
    };
  } catch (error: any) {
    console.error('Error upserting problem code:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to save problem code',
    };
  }
};

/**
 * Get problem code by language
 */
export const getProblemCodeByLanguage = async (
  problemId: number,
  language: string
): Promise<ApiResponse<ProblemCodeResponse>> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/problem-codes/${problemId}/${language}`
    );

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error: any) {
    // 404 is expected when no code exists yet
    if (error.response?.status === 404) {
      return {
        success: false,
        error: 'No code found for this language',
      };
    }
    console.error('Error fetching problem code:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch problem code',
    };
  }
};

/**
 * Get all problem codes for a problem
 */
export const getAllProblemCodes = async (
  problemId: number
): Promise<ApiResponse<ProblemCodeResponse[]>> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/problem-codes/${problemId}`
    );

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error: any) {
    console.error('Error fetching problem codes:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch problem codes',
    };
  }
};

/**
 * Delete problem code
 */
export const deleteProblemCode = async (
  problemId: number,
  language: string,
  token: string
): Promise<ApiResponse<null>> => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/problem-codes/${problemId}/${language}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      success: true,
      message: response.data.message,
    };
  } catch (error: any) {
    console.error('Error deleting problem code:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to delete problem code',
    };
  }
};
