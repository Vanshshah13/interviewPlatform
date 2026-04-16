import express from "express"
import {protect} from "../middleware/authMiddleware.js"
import { createInterview, getAnalytics, getInterviewById, getUserSessions } from "../controllers/interviewController.js";
import { submitAnswers } from "../controllers/interviewController.js";

const router = express.Router();

router.post("/create", protect, createInterview);
router.post("/submit" , protect , submitAnswers);
router.get("/my-session" , protect , getUserSessions);
router.get("/analytics" , protect , getAnalytics);
router.get("/:id" , protect , getInterviewById);

export default router;
