import { z } from 'zod';

// Shared, framework-agnostic validation for the public enquiry form.
// Lives in lib/ (no 'use client') so both the client hook and the server
// API route can import it without dragging client-only code onto the server.

export const BUDGET_OPTIONS = [
  'under-10L',
  '10-25L',
  '25-50L',
  '50L+',
] as const;

export const quoteSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Enter a valid email address'),
  company: z.string().min(2, 'Company must be at least 2 characters'),
  theatre: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  budget: z.enum(BUDGET_OPTIONS).optional(),
});

export type QuoteFormValues = z.infer<typeof quoteSchema>;
