import { useState } from 'react';
import { toast } from "react-toastify";
import { useAuthContext } from '../context/AuthContext';

function handleInputError({ username, email, password, confirmPassword }: any): boolean {
    if (!username || !email || !password || !confirmPassword) {
        toast.error('Please fill in all fields');
        return false;
    }
    if (password !== confirmPassword) {
        toast.error('Password do not match');
        return false;
    }
    if (password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return false;
    }
    return true;
}

const useSignup = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const { setAuthUser } = useAuthContext();

    const signup = async ({ username, email, password, confirmPassword }: any) => {
        const success = handleInputError({ username, email, password, confirmPassword });
        if (!success) return;

        setLoading(true);
        try {
            const res = await fetch(`http://localhost:3000/api/users/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await res.json();
            if (!res.ok) {
                console.log(data.errors[0].message);
                throw new Error(data?.errors[0].message || data?.message || 'Signup failed');
            }
            console.log("JSON.stringify(data.token)", JSON.stringify(data.token));
            if (data.token) {
                localStorage.setItem("codura-token", JSON.stringify(data));
                // Structure the auth user properly
                const authUserData = {
                    id: data.user.id,
                    name: data.user.username,
                    email: data.user.email,
                    image: data.user.profile_image,
                    token: data.token,
                    role: data.user.role,
                };
                setAuthUser(authUserData);
                toast.success("Signup successful! Welcome!");
                return true;
            }
            toast.error("You are not authorized to signup");
            return false;
        } catch (error: any) {
            toast.error(error.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { loading, signup };
};

export default useSignup;