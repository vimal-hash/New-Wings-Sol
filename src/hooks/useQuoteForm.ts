'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

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

export function useQuoteForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      theatre: '',
      message: '',
      budget: undefined,
    },
  });

  const submit: SubmitHandler<QuoteFormValues> = async (values) => {
    setErrorMessage(null);

    // Persist the lead to Supabase. `id`, `created_at`, and `status`
    // are all set by the database, so we only send the form fields.
    const { error } = await supabase.from('quotes').insert({
      name: values.name,
      email: values.email,
      company: values.company,
      theatre: values.theatre || null,
      message: values.message,
      budget: values.budget ?? null,
    });

    if (error) {
      setErrorMessage('Failed to send. Please try or call us directly.');
      return;
    }

    setIsSuccess(true);
    form.reset();
  };

  return {
    form,
    onSubmit: form.handleSubmit(submit),
    isSubmitting: form.formState.isSubmitting,
    isSuccess,
    errorMessage,
    errors: form.formState.errors,
  };
}

export default useQuoteForm;
