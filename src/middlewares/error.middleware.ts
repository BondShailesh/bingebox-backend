import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // zod validation error
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      errors: err.issues.map((error) => ({
        field: error.path[0],
        message: error.message,
      })),
    });
  }

  return res.status(500).json({
    success: false,
    message: err.message || "Server Error",
  });
};