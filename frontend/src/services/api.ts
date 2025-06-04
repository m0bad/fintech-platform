import {
  DisbursementRequest,
  ApiResponse,
  CreateDisbursementRequest,
  UpdateDisbursementRequest,
  DisbursementRequestFilters,
  API_ENDPOINTS,
} from '@fintech-platform/shared';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Generic API request function with error handling
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      throw new ApiError(response.status, `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(0, `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * API service for disbursement requests
 */
export const disbursementRequestsApi = {
  async getAll(filters?: DisbursementRequestFilters, page?: number, limit?: number): Promise<ApiResponse<DisbursementRequest[]>> {
    const searchParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          // Convert all values to string for URL params
          const stringValue = String(value);
          if (stringValue.trim() !== '') {
            searchParams.append(key, stringValue);
          }
        }
      });
    }
    
    const queryString = searchParams.toString();
    const endpoint = queryString 
      ? `${API_ENDPOINTS.DISBURSEMENT_REQUESTS}?${queryString}`
      : API_ENDPOINTS.DISBURSEMENT_REQUESTS;
    
    return apiRequest<DisbursementRequest[]>(endpoint);
  },

  /**
   * Get a specific disbursement request by ID
   */
  async getById(id: string): Promise<ApiResponse<DisbursementRequest>> {
    return apiRequest<DisbursementRequest>(API_ENDPOINTS.DISBURSEMENT_REQUEST_BY_ID(id));
  },

  /**
   * Create a new disbursement request
   */
  async create(data: CreateDisbursementRequest): Promise<ApiResponse<DisbursementRequest>> {
    return apiRequest<DisbursementRequest>(API_ENDPOINTS.DISBURSEMENT_REQUESTS, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update a disbursement request
   */
  async update(id: string, data: UpdateDisbursementRequest): Promise<ApiResponse<DisbursementRequest>> {
    return apiRequest<DisbursementRequest>(API_ENDPOINTS.DISBURSEMENT_REQUEST_BY_ID(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get overview statistics
   */
  async getStats(): Promise<ApiResponse<any>> {
    return apiRequest<any>(`${API_ENDPOINTS.DISBURSEMENT_REQUESTS}/stats/overview`);
  },
};