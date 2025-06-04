'use client';

import { useState } from 'react';
import { Eye, User, DollarSign, Calendar, Tag } from 'lucide-react';
import { DisbursementRequest, formatCurrency, formatDate, formatRelativeTime } from '@fintech-platform/shared';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ViewRequestDialogProps {
  request: DisbursementRequest;
  trigger?: React.ReactNode;
}

const StatusBadge = ({ status }: { status: DisbursementRequest['status'] }) => {
  const getStatusStyle = (status: DisbursementRequest['status']) => {
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

  return (
    <Badge variant="outline" className={getStatusStyle(status)}>
      {status}
    </Badge>
  );
};

export const ViewRequestDialog = ({ request, trigger }: ViewRequestDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Request Details
          </DialogTitle>
          <DialogDescription>
            Detailed information about the disbursement request
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Status Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Status
                </CardTitle>
                <StatusBadge status={request.status} />
              </div>
            </CardHeader>
          </Card>

          {/* Borrower Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <User className="h-4 w-4" />
                Borrower Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Name:</span>
                <span className="font-medium">{request.borrowerName}</span>
              </div>
            </CardContent>
          </Card>

          {/* Loan Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Loan Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Amount:</span>
                <span className="font-semibold text-lg">
                  {formatCurrency(request.loanAmount)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Submitted:</span>
                <div className="text-right">
                  <div className="font-medium text-sm">
                    {formatDate(request.submittedAt)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatRelativeTime(request.submittedAt)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Request ID */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Request ID:</span>
                <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                  {request.id}
                </code>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 