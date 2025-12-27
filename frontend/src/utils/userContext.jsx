import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "./axiosInstance.js";

// Create Context
const UserContext = createContext(null);

// Custom hook for easy usage
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // store user profile
    const [loading, setLoading] = useState(true); // to prevent flickering

    // Fetch user profile if JWT cookie exists
    const fetchProfile = async () => {
        try {
            const res = await axiosInstance.get("/user/getProfile");
            console.log(res.data);
            setUser(res.data); // { id, name, email, role }
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        await axiosInstance.post("/auth/logout");
        setUser(null);
        window.location.href = "/login";
    };

    // Run once when app loads
    useEffect(() => {
        fetchProfile();
    }, []);

    return <UserContext.Provider value={{ user, setUser, logout, loading }}>{children}</UserContext.Provider>;
};
