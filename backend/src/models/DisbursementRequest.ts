import { v4 as uuidv4 } from 'uuid';
import {
  DisbursementRequest,
  DisbursementStatus,
  CreateDisbursementRequest,
  UpdateDisbursementRequest,
  DisbursementRequestFilters,
} from '@fintech-platform/shared';

class DisbursementRequestModel {
  private requests: DisbursementRequest[] = [];

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData(): void {
    const sampleRequests: Omit<DisbursementRequest, 'id'>[] = [
      {
        borrowerName: 'Jane K.',
        loanAmount: 15000,
        status: 'Pending',
        submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        borrowerName: 'Michael A.',
        loanAmount: 75000,
        status: 'Approved',
        submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        borrowerName: 'Sarah B.',
        loanAmount: 8500,
        status: 'Pending',
        submittedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      },
      {
        borrowerName: 'David L.',
        loanAmount: 120000,
        status: 'Rejected',
        submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        borrowerName: 'Emma T.',
        loanAmount: 45000,
        status: 'Approved',
        submittedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      },
      {
        borrowerName: 'Robert M.',
        loanAmount: 25000,
        status: 'Pending',
        submittedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      },
      {
        borrowerName: 'Lisa P.',
        loanAmount: 7200,
        status: 'Approved',
        submittedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      },
      {
        borrowerName: 'James W.',
        loanAmount: 95000,
        status: 'Pending',
        submittedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      },
    ];

    this.requests = sampleRequests.map(request => ({
      ...request,
      id: uuidv4(),
    }));
  }

  findAll(filters?: DisbursementRequestFilters): DisbursementRequest[] {
    let filteredRequests = [...this.requests];

    if (filters?.status) {
      filteredRequests = filteredRequests.filter(req => req.status === filters.status);
    }

    // Sort by submission date (newest first)
    return filteredRequests.sort((a, b) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  }

  findById(id: string): DisbursementRequest | undefined {
    return this.requests.find(request => request.id === id);
  }

  create(data: CreateDisbursementRequest): DisbursementRequest {
    const newRequest: DisbursementRequest = {
      id: uuidv4(),
      borrowerName: data.borrowerName,
      loanAmount: data.loanAmount,
      status: 'Pending',
      submittedAt: new Date().toISOString(),
    };

    this.requests.push(newRequest);
    return newRequest;
  }

  update(id: string, data: UpdateDisbursementRequest): DisbursementRequest | null {
    const requestIndex = this.requests.findIndex(request => request.id === id);
    
    if (requestIndex === -1) {
      return null;
    }

    this.requests[requestIndex] = {
      ...this.requests[requestIndex],
      ...data,
    };

    return this.requests[requestIndex];
  }

  delete(id: string): boolean {
    const requestIndex = this.requests.findIndex(request => request.id === id);
    
    if (requestIndex === -1) {
      return false;
    }

    this.requests.splice(requestIndex, 1);
    return true;
  }

  getStatusCounts(): Record<DisbursementStatus, number> {
    return this.requests.reduce((counts, request) => {
      counts[request.status] = (counts[request.status] || 0) + 1;
      return counts;
    }, {} as Record<DisbursementStatus, number>);
  }

  getTotalAmountByStatus(): Record<DisbursementStatus, number> {
    return this.requests.reduce((totals, request) => {
      totals[request.status] = (totals[request.status] || 0) + request.loanAmount;
      return totals;
    }, {} as Record<DisbursementStatus, number>);
  }
}

export const disbursementRequestModel = new DisbursementRequestModel(); 