'use client';

import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { CreateDisbursementRequest } from '@fintech-platform/shared';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface NewRequestDialogProps {
  onSubmit: (data: CreateDisbursementRequest) => Promise<void>;
  trigger?: React.ReactNode;
}

export const NewRequestDialog = ({ onSubmit, trigger }: NewRequestDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateDisbursementRequest>({
    borrowerName: '',
    loanAmount: 0,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CreateDisbursementRequest, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateDisbursementRequest, string>> = {};

    if (!formData.borrowerName.trim()) {
      newErrors.borrowerName = 'Borrower name is required';
    } else if (formData.borrowerName.length < 2 || formData.borrowerName.length > 100) {
      newErrors.borrowerName = 'Borrower name must be between 2 and 100 characters';
    }

    if (!formData.loanAmount || formData.loanAmount <= 0) {
      newErrors.loanAmount = 'Loan amount must be greater than 0';
    } else if (formData.loanAmount > 10000000) {
      newErrors.loanAmount = 'Loan amount cannot exceed $10,000,000';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await onSubmit(formData);
      setFormData({ borrowerName: '', loanAmount: 0 });
      setErrors({});
      setOpen(false);
    } catch (error) {
      console.error('Failed to create request:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateDisbursementRequest, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAmountChange = (value: string) => {
    const numericValue = parseFloat(value) || 0;
    handleInputChange('loanAmount', numericValue);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Request
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Disbursement Request</DialogTitle>
            <DialogDescription>
              Submit a new loan disbursement request for review and approval.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="borrowerName">Borrower Name</Label>
              <Input
                id="borrowerName"
                placeholder="Enter borrower name"
                value={formData.borrowerName}
                onChange={(e) => handleInputChange('borrowerName', e.target.value)}
                className={errors.borrowerName ? 'border-red-500' : ''}
              />
              {errors.borrowerName && (
                <p className="text-sm text-red-500">{errors.borrowerName}</p>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="loanAmount">Loan Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  $
                </span>
                <Input
                  id="loanAmount"
                  type="number"
                  placeholder="0.00"
                  min="1"
                  max="10000000"
                  step="0.01"
                  value={formData.loanAmount || ''}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className={`pl-6 ${errors.loanAmount ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.loanAmount && (
                <p className="text-sm text-red-500">{errors.loanAmount}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 