import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes";
import cookieParser from "cookie-parser";
import movieRoutes from "./routes/movie.routes";
import { errorHandler } from "./middlewares/error.middleware";
import { connectRedis } from "./config/redis";

dotenv.config();

const app = express();

app.use(cors({
   origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API Running...");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/movies", movieRoutes);

app.use(errorHandler);
const PORT = process.env.PORT || 3001;

mongoose
  .connect(process.env.MONGODB_URL as string)
  .then(async () => {
    console.log("MongoDB Connected");

    await connectRedis();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })