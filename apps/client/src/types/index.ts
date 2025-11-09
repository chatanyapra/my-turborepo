import type { Dispatch, SetStateAction, ReactNode } from "react";

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    image?: string;
    token: string;
    role?: string;
}
export interface AuthContextProps {
    authUser: AuthUser | null;
    setAuthUser: Dispatch<SetStateAction<AuthUser | null>>;
}

export interface AuthContextProviderProps {
    children: ReactNode;
}
export interface SignupData {
    fullname: string;
    username: string;
    password: string;
    confirmPassword: string;
}

// Problem Submission Types
export interface Example {
    input: string;
    output: string;
    explanation?: string;
    image?: string;
}

export interface TestCase {
    input: string;
    expected_output: string;
}

export interface ProblemFormData {
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    constraints: string;
    examples: Example[];
    test_cases: TestCase[];
    tags: string[];
    time_limit: number;
    memory_limit: number;
}

// Database Problem Types
export interface Problem {
    id: number;
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    constraints: string;
    examples: Example[];
    testCases?: TestCase[];
    tags: string[];
    timeLimit: number;
    memoryLimit: number;
    createdBy: number;
    createdAt: string;
    updatedAt: string;
}

export interface ProblemListItem {
    id: number;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    tags: string[];
    acceptance?: number;
    solved?: boolean;
}