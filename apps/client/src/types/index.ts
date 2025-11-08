import type { Dispatch, SetStateAction, ReactNode } from "react";

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    image?: string;
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