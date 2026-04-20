import express from "express"
import dotenv from "dotenv"
dotenv.config();
import cors from "cors"
import { connectDB } from "./config/db.js";
import userRouter from "./routes/authRoutes.js"
import interviewRouter from "./routes/interviewRoutes.js"


connectDB();

const app = express();

app.use(cors({
  origin: "https://interview-platform-ten-rho.vercel.app/",
  credentials: true
}));
app.use(express.json());

app.use("/api/auth", userRouter);
app.use("/api/interview" , interviewRouter)

app.get("/", (req, res) => {
  res.send("API Running...");
});

const PORT = process.env.PORT;


app.listen(PORT, () =>{
  console.log(`Server running on port ${PORT}`);
});
