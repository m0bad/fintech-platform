'use client';

import { useState } from 'react';
import { Check, X, Clock, Eye } from 'lucide-react';
import {
  DisbursementRequest,
  DisbursementStatus,
  formatCurrency,
  formatDate,
  formatRelativeTime,
  getStatusColor,
} from '@fintech-platform/shared';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ViewRequestDialog } from './ViewRequestDialog';
import { cn } from '@/lib/utils';

interface DisbursementRequestsTableProps {
  requests: DisbursementRequest[];
  loading: boolean;
  onUpdateStatus: (id: string, status: DisbursementStatus) => Promise<void>;
}

const StatusBadge = ({ status }: { status: DisbursementStatus }) => {
  const getStatusStyle = (status: DisbursementStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: DisbursementStatus) => {
    switch (status) {
      case 'Pending':
        return <Clock className="w-3 h-3" />;
      case 'Approved':
        return <Check className="w-3 h-3" />;
      case 'Rejected':
        return <X className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <Badge variant="outline" className={cn('gap-1', getStatusStyle(status))}>
      {getStatusIcon(status)}
      {status}
    </Badge>
  );
};

const ActionButtons = ({ 
  request, 
  onUpdateStatus,
  isUpdating 
}: { 
  request: DisbursementRequest;
  onUpdateStatus: (id: string, status: DisbursementStatus) => Promise<void>;
  isUpdating: boolean;
}) => {
  const isPending = request.status === 'Pending';

  if (!isPending) {
    return (
      <div className="flex gap-2">
        <ViewRequestDialog request={request} />
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
        onClick={() => onUpdateStatus(request.id, 'Approved')}
        disabled={isUpdating}
        title="Approve"
      >
        <Check className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
        onClick={() => onUpdateStatus(request.id, 'Rejected')}
        disabled={isUpdating}
        title="Reject"
      >
        <X className="h-4 w-4" />
      </Button>
      <ViewRequestDialog request={request} />
    </div>
  );
};

export const DisbursementRequestsTable = ({
  requests,
  loading,
  onUpdateStatus,
}: DisbursementRequestsTableProps) => {
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());

  const handleStatusUpdate = async (id: string, status: DisbursementStatus) => {
    try {
      setUpdatingIds(prev => new Set(prev).add(id));
      await onUpdateStatus(id, status);
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setUpdatingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Borrower Name</TableHead>
                <TableHead>Loan Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
                  </TableCell>
                  <TableCell>
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-16" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="w-full">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Borrower Name</TableHead>
                <TableHead>Loan Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-muted-foreground">No disbursement requests found</p>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your filters or check back later
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Borrower Name</TableHead>
              <TableHead>Loan Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">
                  {request.borrowerName}
                </TableCell>
                <TableCell>
                  <span className="font-semibold">
                    {formatCurrency(request.loanAmount)}
                  </span>
                </TableCell>
                <TableCell>
                  <StatusBadge status={request.status} />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm">
                      {formatDate(request.submittedAt)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeTime(request.submittedAt)}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <ActionButtons
                    request={request}
                    onUpdateStatus={handleStatusUpdate}
                    isUpdating={updatingIds.has(request.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}; 