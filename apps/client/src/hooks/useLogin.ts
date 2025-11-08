import { useState } from 'react';
import { toast } from "react-toastify";
import { useAuthContext } from '../context/AuthContext';

interface LoginData {
    email?: string;
    username?: string;
    password: string;
}

function handleInputError({ username, password }: LoginData): boolean {
    if (!username || !password) {
        toast.error('Please fill in all fields');
        return false;
    }
    if (password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return false;
    }
    return true;
}

const useLogin = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const { setAuthUser } = useAuthContext();

    const login = async ({ email, password }: LoginData) => {
        const success = handleInputError({ email, password });
        if (!success) return;

        setLoading(true);
        try {
            const res = await fetch(`http://localhost:3000/api/user/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }
            localStorage.setItem("codura-token", JSON.stringify(data.token));
            setAuthUser(data);
            toast.success("Login successful! Welcome back!");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { loading, login };
};

export default useLogin;