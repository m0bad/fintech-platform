import { Request, Response } from 'express';
import {
  ApiResponse,
  CreateDisbursementRequest,
  UpdateDisbursementRequest,
  DisbursementRequestFilters,
} from '@fintech-platform/shared';
import { disbursementRequestModel } from '../models/DisbursementRequest.js';
import { slackNotificationService } from '../services/SlackNotificationService.js';

export const disbursementController = {
  /**
   * Get all disbursement requests with optional filtering
   */
  getAllRequests: (req: Request, res: Response<ApiResponse>) => {
    try {
      const filters = req.query as unknown as DisbursementRequestFilters;
      const requests = disbursementRequestModel.findAll(filters);

      res.json({
        success: true,
        data: requests
      });
    } catch (err) {
      console.error(`Error fetching disbursements:`, err);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  },

  /**
   * Get a specific disbursement request by ID
   */
  getRequestById: (req: Request, res: Response<ApiResponse>) => {
    try {
      const request = disbursementRequestModel.findById(req.params.id);

      if (!request) {
        return res.status(404).json({
          success: false,
          error: 'Disbursement request not found',
        });
      }

      res.json({ success: true, data: request });
    } catch (err) {
      console.error(`Error fetching disbursement ${req.params.id}:`, err);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  },

  /**
   * Create a new disbursement request
   */
  createRequest: async (req: Request, res: Response<ApiResponse>) => {
    try {
      const data = req.body as CreateDisbursementRequest;
      const newRequest = disbursementRequestModel.create(data);

      slackNotificationService.notifyNewRequest(newRequest)
        .catch(err => console.error('Slack notification failed:', err));

      res.status(201).json({
        success: true,
        data: newRequest,
        message: 'Disbursement request created successfully',
      });
    } catch (err) {
      console.error('Error creating disbursement:', err);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  },

  /**
   * Update an existing disbursement request
   */
  updateRequest: async (req: Request, res: Response<ApiResponse>) => {
    try {
      const { id } = req.params;
      const updateData = req.body as UpdateDisbursementRequest;
      const originalRequest = disbursementRequestModel.findById(id);
      
      if (!originalRequest) {
        return res.status(404).json({
          success: false,
          error: 'Disbursement request not found',
        });
      }

      const updatedRequest = disbursementRequestModel.update(id, updateData);
      
      if (!updatedRequest) {
        return res.status(404).json({
          success: false,
          error: 'Disbursement request not found',
        });
      }

      const statusChanged = updateData.status && updateData.status !== originalRequest.status;
      if (statusChanged) {
        slackNotificationService.notifyStatusUpdate(updatedRequest)
          .catch(err => console.error('Status update notification failed:', err));
      }

      res.json({
        success: true,
        data: updatedRequest,
        message: 'Disbursement request updated successfully',
      });
    } catch (err) {
      console.error(`Error updating disbursement ${req.params.id}:`, err);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  },

  /**
   * Delete a disbursement request
   */
  deleteRequest: (req: Request, res: Response<ApiResponse>) => {
    try {
      const { id } = req.params;
      const deleted = disbursementRequestModel.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Disbursement request not found',
        });
      }

      res.json({
        success: true,
        message: 'Disbursement request deleted successfully',
      });
    } catch (err) {
      console.error(`Error deleting disbursement ${req.params.id}:`, err);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  },

  /**
   * Get overview statistics
   */
  getStats: (req: Request, res: Response<ApiResponse>) => {
    try {
      const allRequests = disbursementRequestModel.findAll();
      const stats = {
        totalRequests: allRequests.length,
        statusCounts: disbursementRequestModel.getStatusCounts(),
        totalAmountsByStatus: disbursementRequestModel.getTotalAmountByStatus(),
        totalAmount: allRequests.reduce((sum, req) => sum + req.loanAmount, 0),
      };

      res.json({ success: true, data: stats });
    } catch (err) {
      console.error('Error fetching stats:', err);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
}; 