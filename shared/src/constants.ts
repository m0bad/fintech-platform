export const LOAN_AMOUNT_TIERS = {
  SMALL: 10000,  // < $10,000
  LARGE: 50000,  // >= $50,000
} as const;

export const API_ENDPOINTS = {
  DISBURSEMENT_REQUESTS: '/api/requests',
  DISBURSEMENT_REQUEST_BY_ID: (id: string) => `/api/requests/${id}`,
} as const;

export const DISBURSEMENT_STATUSES = {
  PENDING: 'Pending',
  APPROVED: 'Approved', 
  REJECTED: 'Rejected',
} as const;

export const SLACK_COLORS = {
  PENDING: '#fbbf24',   // yellow
  APPROVED: '#10b981',  // green
  REJECTED: '#ef4444',  // red
  INFO: '#3b82f6',      // blue
} as const;

export const SERVER_CONFIG = {
  DEFAULT_PORT: 3001,
  CORS_ORIGINS: ['http://localhost:3000'],
} as const; 