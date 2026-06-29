'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  quoteSchema,
  BUDGET_OPTIONS,
  type QuoteFormValues,
} from '@/lib/enquiry-schema';

// Re-export so existing imports from this hook keep working.
export { quoteSchema, BUDGET_OPTIONS };
export type { QuoteFormValues };

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

    // Submit through the server route: it saves the lead (service-role) AND
    // emails a copy to the business inbox. We never touch Supabase from the
    // browser here, so the public anon key needs no write access at all.
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        setErrorMessage('Failed to send. Please try or call us directly.');
        return;
      }
    } catch {
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
