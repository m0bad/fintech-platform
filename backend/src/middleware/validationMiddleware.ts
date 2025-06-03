import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ApiResponse } from '@fintech-platform/shared';

export const validateRequest = <T>(
  validator: (data: unknown) => { success: boolean; data?: T; error?: ZodError },
  source: 'body' | 'query' | 'params' = 'body'
) => {
  return (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    const result = validator(req[source]);
    
    if (!result.success) {
      const formattedErrors: Record<string, string[]> = {};
      
      if (result.error) {
        result.error.errors.forEach(err => {
          const path = err.path.join('.');
          if (!formattedErrors[path]) {
            formattedErrors[path] = [];
          }
          formattedErrors[path].push(err.message);
        });
      }
      
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        errors: formattedErrors,
      });
    }
    
    // Add validated data to request
    req[source] = result.data;
    next();
  };
}; 