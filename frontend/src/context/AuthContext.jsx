import React, { createContext, useEffect, useState } from "react";
import axios from "../../api/axios";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ===============================
     VERIFY TOKEN ON REFRESH
  =============================== */
  useEffect(() => {
    const token = localStorage.getItem("token");

    const verify = async () => {
      try {
        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }

        const res = await axios.post(
          "/api/auth/verify",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data?.success) {
          setUser(res.data.user);
        } else {
          setUser(null);
          localStorage.removeItem("token");
        }
      } catch (err) {
        setUser(null);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, []);

  /* ===============================
     LOGIN (🔥 MISSING BEFORE)
  =============================== */
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  /* ===============================
     LOGOUT
  =============================== */
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,     // ✅ NOW AVAILABLE
        logout,    // ✅ OPTIONAL BUT GOOD
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
