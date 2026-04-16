import { InterviewSession } from "../models/InterviewSession.js";
import { generateQuestions } from "../utils/generateQuestions.js";
import { evaluateAnswers } from "../utils/evaluateAnswers.js";

export const createInterview = async (req, res) => {
  try {
    const { role, difficulty, count } = req.body;

    if (!role || !difficulty || !count) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const questionsArray = await generateQuestions(role, difficulty, count);

    if (!questionsArray || questionsArray.length === 0) {
      return res.status(400).json({ message: "Failed to generate questions" });
    }
    const session = await InterviewSession.create({
      userId: req.user,
      role,
      difficulty,
      questions: questionsArray,
    });

    res.status(201).json({
      sessionId: session._id,
      role: session.role,
      difficulty: session.difficulty,
      questions: session.questions, 
      createdAt: session.createdAt,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Interview creation failed" });
  }
};

export const submitAnswers = async (req, res) => {
  try {
    const { sessionId, answers } = req.body;

    if (!sessionId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({
        message: "Session ID and answers are required",
      });
    }

    const session = await InterviewSession.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const cleanedAnswers = answers.map(a => a.trim());

    const invalidAnswers = cleanedAnswers.map(answer => {
      if (answer.length < 5) return true;   // too short
      if (!/[a-zA-Z]/.test(answer)) return true; // no real letters
      return false;
    });

    const aiResult = await evaluateAnswers(
      session.questions,
      cleanedAnswers
    );

    const finalScores = aiResult.scores.map((score, index) => {
      if (invalidAnswers[index]) {
        return 0;
      }
      return score;
    });

    const overall =
      finalScores.reduce((a, b) => a + b, 0) /
      finalScores.length;

    session.answers = cleanedAnswers;
    session.scores = finalScores;
    session.overallScore = Number(overall.toFixed(2));
    session.feedback = aiResult.feedback;

    await session.save();

    res.json({
      sessionId: session._id,
      questions: session.questions,
      answers: session.answers,
      scores: session.scores,
      overallScore: session.overallScore,
      feedback: session.feedback,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Submission failed" });
  }
};



export const getUserSessions = async (req, res) => {
  try {
    const sessions = await InterviewSession.find({
      userId: req.user
    }).sort({ createdAt: -1 });

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const sessions = await InterviewSession.find({
      userId: req.user
    });

    if (sessions.length === 0) {
      return res.json({
        totalInterviews: 0,
        averageScore: 0,
        bestScore: 0,
        scoreTrend: []
      });
    }

    const totalInterviews = sessions.length;

    const scores = sessions
      .filter(s => s.overallScore !== undefined && s.overallScore !== null)
      .map(s => s.overallScore);

    const averageScore =
      scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

    const bestScore = scores.length > 0 ? Math.max(...scores) : 0;

    const scoreTrend = sessions.map(s => ({
      date: s.createdAt,
      score: s.overallScore ?? 0
    }));

    res.json({
      totalInterviews,
      averageScore: averageScore.toFixed(2),
      bestScore,
      scoreTrend
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getInterviewById = async (req, res) => {
  try {
    const session = await InterviewSession.findById(req.params.id);

    if (!session)
      return res.status(404).json({ message: "Not found" });

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
