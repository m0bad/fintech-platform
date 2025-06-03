import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '@fintech-platform/shared';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): void => {
  const timestamp = new Date().toISOString();
  const reqInfo = `${req.method} ${req.url}`;
  
  console.error(`[${timestamp}] Error in ${reqInfo}:`, {
    message: error.message,
    stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
  });

  const isDev = process.env.NODE_ENV === 'development';
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: isDev ? error.message : undefined,
  });
};

export const notFoundHandler = (
  req: Request,
  res: Response<ApiResponse>,
  _next: NextFunction
): void => {
  const msg = `Cannot ${req.method} ${req.path}`;
  
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: msg,
  });
};

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const startTime = Date.now();
  const logRequest = () => {
    const duration = Date.now() - startTime;
    const status = res.statusCode;
    const logLevel = status >= 400 ? 'warn' : 'info';
    
    console[logLevel](`${req.method} ${req.path} - ${status} (${duration}ms)`);
  };
  
  res.on('finish', logRequest);
  next();
}; 