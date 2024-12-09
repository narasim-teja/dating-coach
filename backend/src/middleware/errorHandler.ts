import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

export class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
  } else {
    console.error('Error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
}; 