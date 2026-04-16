import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import GlassCard from "../components/GlassCard";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/auth/login", {
        email,
        password,
      });
      login(data.data);
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-30 -top-20 -left-20 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-30 -bottom-20 -right-20 animate-pulse"></div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <GlassCard className="w-96">

          <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            AI Interview Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              className="w-full py-3 rounded-lg font-semibold 
              bg-gradient-to-r from-purple-600 to-blue-600 
              hover:scale-105 transform transition duration-300"
            >
              Login
            </button>
          </form>

          <p className="text-center text-sm mt-4 text-gray-300">
            Don't have an account?{" "}
            <Link to="/register" className="text-purple-400 hover:underline">
              Register
            </Link>
          </p>

        </GlassCard>
      </motion.div>
    </div>
  );
};

export default Login;
