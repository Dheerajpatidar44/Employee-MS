import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  /* ===============================
     AUTO REDIRECT IF ALREADY LOGGED IN
  =============================== */
  useEffect(() => {
    if (!authLoading && user) {
      if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/employee-dashboard");
      }
    }
  }, [user, authLoading, navigate]);

  /* ===============================
     LOGIN SUBMIT
  =============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post("/api/auth/login", {
        email,
        password,
      });

      // 🔎 Debug (optional)
      console.log("LOGIN RESPONSE:", response.data);

      if (!response.data.success) {
        setError("Invalid email or password");
        return;
      }

      // ✅ SAVE TOKEN FIRST
      localStorage.setItem("token", response.data.token);

      // ✅ SAVE USER IN CONTEXT
      login(response.data.user);

      // ✅ ROLE BASED REDIRECT
      if (response.data.user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/employee-dashboard");
      }

    } catch (err) {
      console.error("LOGIN ERROR:", err);  

      // ✅ CORRECT ERROR HANDLING
      setError(
        err.response?.data?.message ||
        err.message ||
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-700 via-blue-500 to-cyan-500 text-white p-4 space-y-8 relative overflow-hidden">

      {/* TITLE */}
      <div className="z-10 text-center">
        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600">
          Employee
        </h1>
        <h2 className="text-4xl mt-2">Management System</h2>
      </div>

      {/* LOGIN CARD */}
      <div className="w-full max-w-md bg-gray-900/70 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-gray-700 z-10">
        {error && (
          <p className="text-red-500 text-center mb-4">
            {error}
          </p>
        )}

        <h2 className="text-3xl font-bold text-center mb-8">
          Login
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>

          {/* EMAIL */}
          <div>
            <label className="block mb-2 text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl outline-none"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block mb-2 text-sm">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 pr-12 bg-gray-800 border border-gray-700 rounded-xl outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3 text-sm"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 rounded-xl font-semibold disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
