import type { AuthContextProps, AuthContextProviderProps, AuthUser } from "../types";
import React, {
    createContext,
    useContext,
    useState,
} from "react";

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuthContext = (): AuthContextProps => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuthContext must be used within an AuthContextProvider");
    }
    return context;
};

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
    const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
        const stored = localStorage.getItem("codura-token");
        if (!stored || stored === "null") return null;
        
        try {
            const parsed = JSON.parse(stored);
            // Ensure the user object has the role from the nested user object if it exists
            if (parsed.user && parsed.token) {
                return {
                    id: parsed.user.id,
                    name: parsed.user.username,
                    email: parsed.user.email,
                    image: parsed.user.profile_image,
                    token: parsed.token,
                    role: parsed.user.role,
                };
            }
            return parsed;
        } catch {
            return null;
        }
    });
    console.log("authUser", authUser);

    return (
        <AuthContext.Provider value={{ authUser, setAuthUser }}>
            {children}
        </AuthContext.Provider>
    );
};
