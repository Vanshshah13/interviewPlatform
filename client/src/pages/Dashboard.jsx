import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { Line } from "react-chartjs-2";
import API from "../services/api";
import GlassCard from "../components/GlassCard";
import Navbar from "../components/Navbar";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const navigate = useNavigate();

useEffect(() => {
  const fetchAnalytics = async () => {
    try {
      const { data } = await API.get("/interview/analytics");
      setAnalytics(data);
    } catch (error) {
      console.error("Analytics error:", error);
    }
  };
  fetchAnalytics();
}, []);


  if (!analytics) return <div className="p-10">Loading...</div>;

  const chartData = {
    labels: analytics.scoreTrend.map((item) =>
      new Date(item.date).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Score Trend",
        data: analytics.scoreTrend.map((item) => item.score),
      },
    ],
  };

  return (
    <div className="min-h-screen p-6">
      <Navbar />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid md:grid-cols-3 gap-6 mt-6"
      >
        <GlassCard>
          <h3 className="text-gray-300">Total Interviews</h3>
          <p className="text-3xl font-bold">
            {analytics.totalInterviews}
          </p>
        </GlassCard>

        <GlassCard>
          <h3 className="text-gray-300">Average Score</h3>
          <p className="text-3xl font-bold">
            {analytics.averageScore}
          </p>
        </GlassCard>

        <GlassCard>
          <h3 className="text-gray-300">Best Score</h3>
          <p className="text-3xl font-bold">
            {analytics.bestScore}
          </p>
        </GlassCard>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-10"
      >
        <GlassCard>
          <h2 className="text-xl font-semibold mb-4">
            Performance Trend
          </h2>
          <Line data={chartData} />
        </GlassCard>
      </motion.div>

      <div className="mt-10 flex justify-center">
        <button
          onClick={() => navigate("/create")}
          className="px-8 py-4 rounded-xl font-semibold 
          bg-gradient-to-r from-purple-600 to-blue-600 
          hover:scale-105 transform transition duration-300"
        >
          Start New Interview
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
