export type { 
  CreateDisbursementSchema as CreateDisbursementRequest,
  UpdateDisbursementSchema as UpdateDisbursementRequest,
  DisbursementFilterSchema as DisbursementRequestFilters
} from './validation';

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
  errors?: Record<string, string[]>;
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