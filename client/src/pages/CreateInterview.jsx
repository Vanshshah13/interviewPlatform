import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";
import GlassCard from "../components/GlassCard";
import Navbar from "../components/Navbar";

const CreateInterview = () => {
  const [role, setRole] = useState("Frontend Developer");
  const [difficulty, setDifficulty] = useState("Medium");
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const { data } = await API.post("/interview/create", {
        role,
        difficulty,
        count,
      });


      navigate(`/interview/${data.sessionId}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create interview");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <Navbar />

      <div className="flex justify-center mt-16">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard className="w-[400px]">

            <h2 className="text-2xl font-bold text-center mb-6 
            bg-gradient-to-r from-purple-400 to-blue-400 
            bg-clip-text text-transparent">
              Create Interview
            </h2>

            <form onSubmit={handleCreate} className="space-y-4">

              {/* Role */}
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-3 rounded-lg 
                bg-white/10 border border-white/20 
                focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option className="text-black">Frontend Developer</option>
                <option className="text-black">Backend Developer</option>
                <option className="text-black">Full Stack Developer</option>
                <option className="text-black">DSA</option>
                <option className="text-black">HR Round</option>
                <option className="text-black">Python</option>
                <option className="text-black">Java</option>
                <option className="text-black">DevOps Engineer</option>
                <option className="text-black">Data Scientist</option>
                <option className="text-black">UI/UX Designer</option>
                <option className="text-black">Cybersecurity Analyst</option>
              </select>

              {/* Difficulty */}
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full p-3 rounded-lg 
                bg-white/10 border text-red  border-white/20 
                focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option className="text-black">Easy</option>
                <option className="text-black">Medium</option>
                <option className="text-black">Hard</option>
              </select>

              {/* Question Count */}
              <input
                type="number"
                min="1"
                max="10"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                className="w-full p-3 rounded-lg 
                bg-white/10 border border-white/20 
                focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg font-semibold 
                bg-gradient-to-r from-purple-600 to-blue-600 
                hover:scale-105 transform transition duration-300 
                disabled:opacity-50"
              >
                {loading ? "Generating..." : "Start Interview"}
              </button>

            </form>

          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateInterview;