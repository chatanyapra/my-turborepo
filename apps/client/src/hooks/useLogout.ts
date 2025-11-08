import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

export const useLogout = () => {
    const { setAuthUser } = useAuthContext();
    const navigate = useNavigate();

    const logout = async () => {
        try {
            localStorage.removeItem("codura-token");
            setAuthUser(null);
            navigate("/login");
        } catch (error) {
            console.log(error);
        }
    };

    return { logout };

}
