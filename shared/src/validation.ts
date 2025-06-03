import { z } from 'zod';

const errorMessages = {
  required: 'This field is required',
  borrowerName: 'Borrower name must be between 2 and 100 characters',
  loanAmount: 'Loan amount must be between $1 and $10,000,000',
  invalidStatus: 'Invalid status value',
};

export const borrowerNameSchema = z.string()
  .min(2, { message: errorMessages.borrowerName })
  .max(100, { message: errorMessages.borrowerName });

export const loanAmountSchema = z.number()
  .min(1, { message: errorMessages.loanAmount })
  .max(10000000, { message: errorMessages.loanAmount });

export const statusSchema = z.enum(['Pending', 'Approved', 'Rejected'] as const, {
  errorMap: () => ({ message: errorMessages.invalidStatus }),
});

// Request schemas
export const createDisbursementSchema = z.object({
  borrowerName: borrowerNameSchema,
  loanAmount: loanAmountSchema,
});

export const updateDisbursementSchema = z.object({
  borrowerName: borrowerNameSchema.optional(),
  loanAmount: loanAmountSchema.optional(),
  status: statusSchema.optional(),
});

export const disbursementFilterSchema = z.object({
  status: statusSchema.optional(),
});

// Helper functions
export const validateCreateDisbursement = (data: unknown) => {
  return createDisbursementSchema.safeParse(data);
};

export const validateUpdateDisbursement = (data: unknown) => {
  return updateDisbursementSchema.safeParse(data);
};

export const validateDisbursementFilter = (data: unknown) => {
  return disbursementFilterSchema.safeParse(data);
};

// Type inference
export type CreateDisbursementSchema = z.infer<typeof createDisbursementSchema>;
export type UpdateDisbursementSchema = z.infer<typeof updateDisbursementSchema>;
export type DisbursementFilterSchema = z.infer<typeof disbursementFilterSchema>; 