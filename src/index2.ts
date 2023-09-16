// src/index.ts

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/AuthRoutes2.js";
import movieRoutes from "./routes/MovieRoutes2.js";
import roleRoutes from "./routes/RoleRoutes.js"; // New import for role routes

// Load environment variables from .env file
dotenv.config();

// Create an Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB (replace DATABASE_URL with your MongoDB connection string)
mongoose.connect(
  process.env.DATABASE_URL || "mongodb://localhost:27017/movie-trailer-db",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes); // Movie routes
app.use("/api/roles", roleRoutes); // New route for role management

// Protected route example
app.get("/api/profile", (req, res) => {
  res
    .status(200)
    .json({ message: "This is a protected route", user: req.user });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
