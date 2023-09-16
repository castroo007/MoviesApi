import mongoose, { Document, Schema } from "mongoose";

const ratingSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  movieId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Movie",
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    default: "",
  },
});

export interface RatingDocument extends Document {
  userId: mongoose.Types.ObjectId;
  movieId: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
}

const RatingModel = mongoose.model<RatingDocument>("Rating", ratingSchema);

export default RatingModel;
