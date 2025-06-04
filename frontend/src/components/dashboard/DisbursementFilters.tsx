'use client';

import { Filter, X } from 'lucide-react';
import {
  DisbursementRequestFilters,
  DisbursementStatus,
} from '@fintech-platform/shared';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DisbursementFiltersProps {
  filters: DisbursementRequestFilters;
  onFiltersChange: (filters: DisbursementRequestFilters) => void;
  totalCount?: number;
  filteredCount?: number;
}

const STATUS_OPTIONS: { value: DisbursementStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Status' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Rejected', label: 'Rejected' },
];

export const DisbursementFilters = ({
  filters,
  onFiltersChange,
  totalCount,
  filteredCount,
}: DisbursementFiltersProps) => {
  const updateFilters = (newFilters: Partial<DisbursementRequestFilters>) => {
    onFiltersChange({ ...filters, ...newFilters });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Boolean(filters.status);

  return (
    <div className="space-y-4">
      {/* Status Filter Row */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Filter by Status:</span>
          </div>
          
          {/* Status Filter */}
          <Select
            value={filters.status || 'all'}
            onValueChange={(value) => 
              updateFilters({ status: value === 'all' ? undefined : value as DisbursementStatus })
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Clear Filter
            </Button>
          )}
        </div>

        {/* Results Count */}
        {totalCount !== undefined && (
          <div className="text-sm text-muted-foreground">
            {hasActiveFilters && filteredCount !== undefined ? (
              <>
                Showing {filteredCount} of {totalCount} requests
                {filters.status && (
                  <Badge variant="secondary" className="ml-2">
                    Status: {filters.status}
                  </Badge>
                )}
              </>
            ) : (
              `${totalCount} request${totalCount !== 1 ? 's' : ''} total`
            )}
          </div>
        )}
      </div>
    </div>
  );
}; 