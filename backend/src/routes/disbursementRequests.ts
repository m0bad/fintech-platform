import { Router } from 'express';
import {
  validateCreateDisbursement, 
  validateUpdateDisbursement,
  validateDisbursementFilter
} from '@fintech-platform/shared';
import { validateRequest } from '../middleware/validationMiddleware.js';
import { disbursementController } from '../controllers/disbursementController.js';

const router = Router();

// GET all disbursement requests with filtering
router.get('/', 
  validateRequest(validateDisbursementFilter, 'query'),
  disbursementController.getAllRequests
);

// GET statistics overview
router.get('/stats/overview', disbursementController.getStats);

// GET request by ID
router.get('/:id', disbursementController.getRequestById);

// CREATE new request
router.post('/', 
  validateRequest(validateCreateDisbursement),
  disbursementController.createRequest
);

// UPDATE request
router.put('/:id', 
  validateRequest(validateUpdateDisbursement),
  disbursementController.updateRequest
);

// DELETE request
router.delete('/:id', disbursementController.deleteRequest);

export default router; 