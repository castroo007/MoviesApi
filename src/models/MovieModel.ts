import mongoose from "mongoose";
import IMovie from "../interfaces/MovieInterface.js";

const MovieSchema = new mongoose.Schema<IMovie>({
  title: {
    type: String,
    required: true,
  },
  releaseDate: {
    type: Date,
    required: true,
  },
  trailerLink: {
    type: String,
    required: true,
  },
  posterUrl: {
    type: String,
    required: true,
  },
  genres: {
    type: [String],
    required: true,
  },
});

export interface IMovieMongoose extends mongoose.Document {
  title: string;
  releaseDate: Date;
  trailerLink: string;
  posterUrl: string;
  genres: string[];
}

const MovieModel = mongoose.model<IMovie>("Movie", MovieSchema);

export default MovieModel;
