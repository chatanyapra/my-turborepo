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
    const [authUser, setAuthUser] = useState<AuthUser | null>(
        JSON.parse(localStorage.getItem("codura-token") || "null")
    );
    console.log("authUser", authUser);

    return (
        <AuthContext.Provider value={{ authUser, setAuthUser }}>
            {children}
        </AuthContext.Provider>
    );
};
