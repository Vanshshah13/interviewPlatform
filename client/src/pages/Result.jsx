import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";
import GlassCard from "../components/GlassCard";
import Navbar from "../components/Navbar";

const Result = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await API.get(`/interview/${id}`);
      setSession(data);
    };
    fetchSession();
  }, [id]);

  if (!session) return <div className="p-10">Loading...</div>;

  return (
    <div className="min-h-screen p-6">
      <Navbar />

      <div className="max-w-3xl mx-auto mt-10 space-y-6">

        {/* Overall Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <GlassCard className="text-center">

            <h2 className="text-xl text-gray-300 mb-2">
              Overall Score
            </h2>

            <p className="text-6xl font-bold 
            bg-gradient-to-r from-purple-400 to-blue-400 
            bg-clip-text text-transparent">
              {session.overallScore || 0}
            </p>

          </GlassCard>
        </motion.div>

        {/* Per Question Scores */}
        <GlassCard>
          <h3 className="text-lg font-semibold mb-4">
            Question Breakdown
          </h3>

          {session.questions.map((q, index) => (
            <div
              key={index}
              className="flex justify-between items-center 
              border-b border-white/10 py-3"
            >
              <p className="text-sm w-3/4 truncate">
                Q{index + 1}
              </p>

              <span className="font-bold text-purple-400">
                {session.scores?.[index] ?? 0}/10
              </span>
            </div>
          ))}
        </GlassCard>

        {/* AI Feedback */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard>
            <h3 className="text-lg font-semibold mb-4">
              AI Feedback
            </h3>

            <p className="text-gray-300 whitespace-pre-line">
              {session.feedback || "No feedback available."}
            </p>
          </GlassCard>
        </motion.div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-8 py-3 rounded-xl font-semibold 
            bg-gradient-to-r from-purple-600 to-blue-600 
            hover:scale-105 transform transition duration-300"
          >
            Back to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
};

export default Result;
