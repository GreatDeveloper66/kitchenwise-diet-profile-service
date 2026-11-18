import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { pathToFileURL } from "node:url";
import connectDB from "../config/db.js";
import {
  createNutritionalProfile,
  getNutritionalProfile,
  updateNutritionalProfile,
  deleteNutritionalProfile
} from "../controllers/nutritionalProfileController.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Example route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello, World!" });
});

app.post("/api/create-nutritional-profile", createNutritionalProfile);
app.get("/api/get-nutritional-profile", getNutritionalProfile);
app.patch("/api/update-nutritional-profile", updateNutritionalProfile);
app.delete("/api/delete-nutritional-profile", deleteNutritionalProfile);

// Vercel imports this file and serves the exported app. When run directly
// (npm run dev / npm start), listen on PORT so the service works locally.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
}

export default app;
