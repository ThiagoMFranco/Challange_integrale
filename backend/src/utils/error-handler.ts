import { Response } from "express";
import { ZodError } from "zod";

export interface AppError extends Error {
  statusCode?: number;
  details?: unknown;
}

export class CustomError extends Error implements AppError {
  statusCode: number;
  details?: unknown;

  constructor(message: string, statusCode: number = 500, details?: unknown) {
    super(message);
    this.name = "CustomError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const handleError = (error: unknown, res: Response): void => {
  console.error("Error:", error);

  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: "Validation error",
      message: "Invalid input data",
      details: error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      })),
    });
    return;
  }

  if (error instanceof CustomError) {
    res.status(error.statusCode).json({
      success: false,
      error: error.message,
      details: error.details,
    });
    return;
  }

  if (error instanceof Error) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: error.message,
    });
    return;
  }

  res.status(500).json({
    success: false,
    error: "Internal server error",
    message: "An unexpected error occurred",
  });
};
