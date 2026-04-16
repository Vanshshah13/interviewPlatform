import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";
import GlassCard from "../components/GlassCard";
import Navbar from "../components/Navbar";

const Interview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await API.get(`/interview/${id}`);
      setSession(data);
      setAnswers(new Array(data.questions.length).fill(""));
    };

    fetchSession();
  }, [id]);

  const handleChange = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await API.post("/interview/submit", {
        sessionId: id,
        answers,
      });

      navigate(`/result/${id}`);
    } catch (error) {
      console.log(error);
      alert("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  if (!session) return <div className="p-10">Loading...</div>;

  return (
    <div className="min-h-screen p-6">
      <Navbar />

      <div className="max-w-3xl mx-auto mt-8 space-y-6">

        <h2 className="text-2xl font-bold text-center 
        bg-gradient-to-r from-purple-400 to-blue-400 
        bg-clip-text text-transparent">
          {session.role} Interview
        </h2>

        {session.questions.map((question, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard>
              <p className="font-semibold mb-3">
                Q{index + 1}. {question}
              </p>

              <textarea
                rows="4"
                placeholder="Type your answer here..."
                value={answers[index]}
                onChange={(e) =>
                  handleChange(index, e.target.value)
                }
                className="w-full p-3 rounded-lg 
                bg-white/10 border border-white/20 
                focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </GlassCard>
          </motion.div>
        ))}

        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-3 rounded-xl font-semibold 
            bg-gradient-to-r from-purple-600 to-blue-600 
            hover:scale-105 transform transition duration-300 
            disabled:opacity-50"
          >
            {loading ? "Evaluating..." : "Submit Answers"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Interview;
