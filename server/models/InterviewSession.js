import mongoose from "mongoose"

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    role: String,
    difficulty: String,
    questions: [String],
    answers: [String],
    scores: [Number],
    overallScore: Number,
    feedback: String,
  },
  { timestamps: true }
);

export const InterviewSession = mongoose.model("InterviewSession", interviewSchema);
