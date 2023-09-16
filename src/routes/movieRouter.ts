import express from "express";
import MovieController from "../controllers/MovieController.js";
import authMiddleware from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.get("/movies", MovieController.getAll);

router.get("/movies/:id", MovieController.getOne);

router.post("/movies", MovieController.create);

router.put("/movies/:id", MovieController.update);

router.delete("/movies/:id", MovieController.delete);

// Create a movie rating
router.post("/ratings", MovieController.create);

// Upload a movie poster image (only accessible to admin users)
// router.post("/upload-poster", authenticateToken, MovieController.uploadPoster);

export default router;
