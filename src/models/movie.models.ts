import { Schema, model, Document } from 'mongoose';

interface IMovie extends Document {
  title: string;
  director: string;
  releaseYear: number;
  genres: {
    type: String,
    enum: ["sci-fi", "adventure", "drama", "comedy", "action", "horror", "romance", "crime", "thriller", "biography", "sport"],
    required: true,
    index: true,
  }
  rating?: number;
  durationMinutes: number;
  createdAt: Date;
}

const movieSchema = new Schema<IMovie>({
  title: { type: String, required: true, trim: true },
  director: { type: String, required: true },
  releaseYear: { type: Number, required: true },
  genres: { type: [String], default: [] },
  rating: { type: Number, min: 0, max: 10 },
  durationMinutes: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Movie = model<IMovie>('Movie', movieSchema);
