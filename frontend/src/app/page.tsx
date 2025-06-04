'use client';

import { useState } from 'react';
import { AlertCircle, RefreshCw, Plus } from 'lucide-react';
import { useDisbursementRequests } from '@/hooks/useDisbursementRequests';
import { DisbursementRequestsTable } from '@/components/dashboard/DisbursementRequestsTable';
import { DisbursementFilters } from '@/components/dashboard/DisbursementFilters';
import { NewRequestDialog } from '@/components/dashboard/NewRequestDialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const {
    requests,
    loading,
    error,
    filters,
    setFilters,
    refetch,
    updateRequestStatus,
    createRequest,
  } = useDisbursementRequests();

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const getStatusCounts = () => {
    return {
      pending: requests.filter(r => r.status === 'Pending').length,
      approved: requests.filter(r => r.status === 'Approved').length,
      rejected: requests.filter(r => r.status === 'Rejected').length,
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-gray-50/30">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Loan Disbursement Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Manage and approve SME loan disbursement requests across Africa
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={refreshing || loading}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <NewRequestDialog onSubmit={createRequest} />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {requests.length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-yellow-600">
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-700">
                {statusCounts.pending}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-600">
                Approved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">
                {statusCounts.approved}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-red-600">
                Rejected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-700">
                {statusCounts.rejected}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle>Disbursement Requests</CardTitle>
            <CardDescription>
              Review and manage loan disbursement requests from SME lenders
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Filters */}
            <DisbursementFilters
              filters={filters}
              onFiltersChange={setFilters}
              totalCount={requests.length}
              filteredCount={requests.length}
            />

            {/* Error Display */}
            {error && (
              <div className="flex items-center gap-3 p-4 text-red-800 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5" />
                <div>
                  <p className="font-medium">Error loading requests</p>
                  <p className="text-sm">{error}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  className="ml-auto"
                >
                  Retry
                </Button>
              </div>
            )}

            {/* Table */}
            <DisbursementRequestsTable
              requests={requests}
              loading={loading}
              onUpdateStatus={updateRequestStatus}
            />

            {/* Simple count display instead of pagination */}
            {!loading && requests.length > 0 && (
              <div className="flex items-center justify-center pt-4 border-t">
                <div className="text-sm text-gray-600">
                  Showing {requests.length} request{requests.length !== 1 ? 's' : ''}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
