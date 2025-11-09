import type { Dispatch, SetStateAction, ReactNode } from "react";

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    image?: string;
    token: string;
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