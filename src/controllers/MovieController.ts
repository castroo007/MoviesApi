import { NextFunction, Request, Response } from "express";
import IMovie from "../interfaces/MovieInterface.js";
import MovieServices from "../services/MovieServices.js";
import ApiError from "../utils/ApiError.js";
import MovieModel from "../models/MovieModel.js";
import RatingModel from "../models/RatingModel.js";
import AuthService from "../services/AuthService.js";
import { IMovieMongoose } from "../models/MovieModel.js";
import { IUser } from "../models/UserModel.js";
import FileService from "../services/FileService.js";
import path from "path";

class MovieController {
  // Controller function to create a movie rating
  async createRating(req: Request, res: Response) {
    try {
      const { userId, movieId, rating, comment } = req.body;

      // Check if the user has already rated the movie
      const existingRating = await RatingModel.findOne({ userId, movieId });

      if (existingRating) {
        return res
          .status(400)
          .json({ error: "You have already rated this movie." });
      }

      const newRating = new RatingModel({
        userId,
        movieId,
        rating,
        comment,
      });

      await newRating.save();

      return res
        .status(201)
        .json({ message: "Movie rating added successfully." });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "An error occurred while adding the movie rating." });
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, releaseDate, trailerLink, genres } = req.body;

      const image = req.files?.image;

      let posterUrl = "no-image.jpg";

      if (image) {
        posterUrl = await FileService.save(image);
      }

      const newMovie = {
        title,
        releaseDate,
        trailerLink,
        posterUrl: posterUrl,
        genres,
      } as IMovie;

      const savedMovie = await MovieServices.createMovie(newMovie);

      res.status(201).json(savedMovie);
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const movie = await MovieServices.getMovieById(id);

      if (!movie) {
        throw ApiError.NotFoundError("Movie Not Found");
      }

      res.json(movie);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sortBy = (req.query.sortBy as string) || "releaseDate";
    const sortOrder = (req.query.sortOrder as string) || "desc";
    const filtersQuery = (req.query.filters as string) || undefined;

    let filters: any = {};

    if (filtersQuery) {
      try {
        filters = JSON.parse(decodeURIComponent(filtersQuery));
      } catch (error) {
        return next(ApiError.BadRequestError("Invalid filters JSON"));
      }
    }
    // const movies = await MovieServices.getAllMovies(page,limit,sortBy,sortOrder,filter);
  }

  async update(req: Request, res: Response) {
    try {
      const movieId = req.params.id;
      const { title, releaseDate, trailerLink, genres } = req.body;

      const image = req.files?.image;

      let posterUrl = "no-image.jpg";
      let existingMovie: IMovieMongoose | null = await MovieModel.findById(
        movieId
      );

      if (existingMovie) {
        if (
          existingMovie.posterUrl &&
          existingMovie.posterUrl !== "no-image.jpg"
        ) {
          await FileService.delete(existingMovie.posterUrl);
        }

        if (image) {
          posterUrl = await FileService.save(image);
        }

        if (!existingMovie) {
          res.status(404).json({ message: "Movie not found" });
        }
        if (existingMovie) {
          existingMovie.title = title || existingMovie.title;
          existingMovie.releaseDate = releaseDate || existingMovie.releaseDate;
          existingMovie.trailerLink = trailerLink || existingMovie.trailerLink;
          existingMovie.posterUrl = posterUrl || existingMovie.posterUrl;
          existingMovie.genres = genres || existingMovie.genres;
          const updatedMovie = await existingMovie.save();
          res.json(updatedMovie);
        }
      }
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .send({ errorMessage: "Failed to update movie", error: err });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const movieId = req.params.id;

      // if (!AuthService.isAdmin(req.user as IUser)) {
      //   return res.status(401).json({ error: "Not authorized" });
      // }

      const deleteMovie: IMovieMongoose | null =
        await MovieModel.findByIdAndDelete(movieId);

      if (!deleteMovie) {
        res.status(404).json({ error: "Movie not found" });
      }

      res.json(deleteMovie);
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .send({ errorMessage: "Failed to delete Movie", error: err });
    }
  }

  // Configure multer for file upload
  // storage = multer.diskStorage({
  //   destination: (req, file, cb) => {
  //     cb(null, path.join(__dirname, "../../static"));
  //   },
  //   filename: (req, file, cb) => {
  //     cb(null, Date.now() + path.extname(file.originalname));
  //   },
  // });

  // upload = multer({ storage });

  // // Upload a movie poster image (only accessible to admin users)
  // async(req: Request, res: Response) {
  //   try {
  //     // Get the uploaded file path
  //     const posterUrl = `/static/${req.file?.filename}`;

  //     return res.status(200).json({ posterUrl });
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(500).json({ message: "Internal server error" });
  //   }
  // }

  // async post(req: Request, res: Response) {
  //   try {
  //     const movieId = req.params.id;
  //     const { rating, comment } = req.body;
  //     const userId = req.user?.userId; // Extract user ID from the JWT token

  //     // Check if the movie exists
  //     const movie = await MovieModel.findById(movieId);

  //     if (!movie) {
  //       return res.status(404).json({ message: "Movie not found" });
  //     }

  //     // Check if the user has already rated the movie
  //     const existingRating = await RatingModel.findOne({ movieId, userId });

  //     if (existingRating) {
  //       return res
  //         .status(400)
  //         .json({ message: "You have already rated this movie" });
  //     }

  //     // Create a new rating
  //     const newRating: IRating = new RatingModel({
  //       movieId,
  //       userId,
  //       rating,
  //       comment,
  //     });
  //     await newRating.save();

  //     return res.status(201).json({ message: "Rating added successfully" });
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(500).json({ message: "Internal server error" });
  //   }
  // }
}

export default new MovieController();
