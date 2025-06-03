import { LOAN_AMOUNT_TIERS } from './constants.js';
import type { DisbursementStatus } from './types.js';

export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
};

export const formatRelativeTime = (dateString: string): string => {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = (now.getTime() - date.getTime()) / 1000;

  if (diffInSeconds < 60) {
    return rtf.format(-Math.floor(diffInSeconds), 'second');
  } else if (diffInSeconds < 3600) {
    return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
  } else if (diffInSeconds < 86400) {
    return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
  } else {
    return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
  }
};

export const getLoanAmountTier = (amount: number): 'small' | 'medium' | 'large' => {
  if (amount < LOAN_AMOUNT_TIERS.SMALL) {
    return 'small';
  } else if (amount >= LOAN_AMOUNT_TIERS.LARGE) {
    return 'large';
  } else {
    return 'medium';
  }
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidLoanAmount = (amount: number): boolean => {
  return amount > 0 && amount <= 10000000;
};

export const isValidBorrowerName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 100;
};

export const getStatusColor = (status: DisbursementStatus): string => {
  switch (status) {
    case 'Pending':
      return 'yellow';
    case 'Approved':
      return 'green';
    case 'Rejected':
      return 'red';
    default:
      return 'gray';
  }
};

export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const placeholderUtil = () => {
}; 