import React from "react";
import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");

        const verify = async () => {
            try {
                if (!token) {
                    setUser(null);
                    return;
                }

                const res = await axios.post(
                    "/api/auth/verify",
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (res.data?.success) {
                    setUser(res.data.user);
                } else {
                    setUser(null);
                }
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        verify();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
