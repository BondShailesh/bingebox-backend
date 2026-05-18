import { Request, Response, NextFunction } from "express";
import { Movie } from '../models/movie.models';
import { redisClient } from '../config/redis';
import { clearMovieCache } from "../utils/cache";

export const addMovie = async (req: Request, res: Response) => {
  try {
    let savedMovies;
    if (Array.isArray(req.body)) {
      savedMovies = await Movie.insertMany(req.body);
    } else {
      const newMovie = new Movie(req.body);
      savedMovies = await newMovie.save();
    }
    await clearMovieCache();
    res.status(201).json({
      success: true,
      data: savedMovies
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to add movie'
    });
  }
};

export const getMovies = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = req.query.q as string;
    const genre = req.query.genre as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const cacheKey = `movies:search:q=${q || ''}:g=${genre || ''}:p=${page}:l=${limit}`;

    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.status(200).json({ success: true, source: 'cache', ...JSON.parse(cachedData) });
    }

    let filter: any = {};
    if (q) filter.title = { $regex: q, $options: 'i' };
    if (genre) filter.genres = genre;

    const [movies, totalMovies] = await Promise.all([
      Movie.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Movie.countDocuments(filter)
    ]);

    const responseData = {
      data: movies,
      pagination: {
        total: totalMovies,
        currentPage: page,
        totalPages: Math.ceil(totalMovies / limit),
        hasNextPage: page * limit < totalMovies
      }
    };

    await redisClient.setEx(cacheKey, 3600, JSON.stringify(responseData));

    res.status(200).json({ success: true, source: 'database', ...responseData });
  } catch (error) {
    next(error);
  }
};

export const getMovieById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }
    res.status(200).json({ success: true, data: movie });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch movie' });
  }
};
