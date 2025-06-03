export type DisbursementStatus = "Pending" | "Approved" | "Rejected";

export interface DisbursementRequest {
  id: string;           // UUID
  borrowerName: string; // e.g. "Jane K."
  loanAmount: number;   // e.g. 15000
  status: DisbursementStatus;
  submittedAt: string;  // ISO date string
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateDisbursementRequest {
  borrowerName: string;
  loanAmount: number;
}

export interface UpdateDisbursementRequest {
  status?: DisbursementStatus;
  borrowerName?: string;
  loanAmount?: number;
}

export interface DisbursementRequestFilters {
  status?: DisbursementStatus;
}

export interface SlackNotificationPayload {
  text: string;
  channel?: string;
  username?: string;
  attachments?: SlackAttachment[];
}

export interface SlackAttachment {
  color: string;
  fields: SlackField[];
  title?: string;
  title_link?: string;
  footer?: string;
  ts?: string;
}

export interface SlackField {
  title: string;
  value: string;
  short: boolean;
} 