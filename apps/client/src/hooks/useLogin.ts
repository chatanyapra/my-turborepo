import { useState } from 'react';
import { toast } from "react-toastify";
import { useAuthContext } from '../context/AuthContext';

interface LoginData {
    email?: string;
    password: string;
}

function handleInputError({ email, password }: LoginData): boolean {
    if (!email || !password) {
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
            const res = await fetch(`http://localhost:3000/api/users/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }
            console.log("JSON.stringify(data.token)", JSON.stringify(data.token));
            if (data.token) {
                localStorage.setItem("codura-token", JSON.stringify(data));
                setAuthUser(data);
                toast.success("Login successful! Welcome back!");
                return true;
            }
            toast.error("You are not authorized to login");
            return false;
        } catch (error: any) {
            toast.error(error.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { loading, login };
};

export default useLogin;