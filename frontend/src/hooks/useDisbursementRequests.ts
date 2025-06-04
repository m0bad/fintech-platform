import { useState, useEffect, useCallback } from 'react';
import {
  DisbursementRequest,
  DisbursementRequestFilters,
  DisbursementStatus,
  CreateDisbursementRequest,
} from '@fintech-platform/shared';
import { disbursementRequestsApi } from '../services/api';

interface UseDisbursementRequestsReturn {
  requests: DisbursementRequest[];
  loading: boolean;
  error: string | null;
  filters: DisbursementRequestFilters;
  setFilters: (filters: DisbursementRequestFilters) => void;
  refetch: () => Promise<void>;
  updateRequestStatus: (id: string, status: DisbursementStatus) => Promise<void>;
  createRequest: (data: CreateDisbursementRequest) => Promise<void>;
}

export const useDisbursementRequests = (): UseDisbursementRequestsReturn => {
  const [requests, setRequests] = useState<DisbursementRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<DisbursementRequestFilters>({});

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all requests without pagination
      const response = await disbursementRequestsApi.getAll(filters);

      if (response.success && response.data) {
        setRequests(response.data);
      } else {
        setError(response.error || 'Failed to fetch requests');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const setFilters = useCallback((newFilters: DisbursementRequestFilters) => {
    setFiltersState(newFilters);
  }, []);

  const updateRequestStatus = useCallback(async (id: string, status: DisbursementStatus) => {
    try {
      const response = await disbursementRequestsApi.update(id, { status });
      
      if (response.success && response.data) {
        // Update the local state optimistically
        setRequests(prev => 
          prev.map(request => 
            request.id === id 
              ? { ...request, status } 
              : request
          )
        );
      } else {
        throw new Error(response.error || 'Failed to update request');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update request');
      throw err; // Re-throw so the component can handle it
    }
  }, []);

  const createRequest = useCallback(async (data: CreateDisbursementRequest) => {
    try {
      const response = await disbursementRequestsApi.create(data);
      
      if (response.success && response.data) {
        // Add the new request to the beginning of the list
        setRequests(prev => [response.data!, ...prev]);
      } else {
        throw new Error(response.error || 'Failed to create request');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create request');
      throw err; // Re-throw so the component can handle it
    }
  }, []);

  const refetch = useCallback(() => fetchRequests(), [fetchRequests]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return {
    requests,
    loading,
    error,
    filters,
    setFilters,
    refetch,
    updateRequestStatus,
    createRequest,
  };
}; 