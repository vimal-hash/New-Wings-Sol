'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface CSVRow {
  id: string;
  name: string;
  tagline: string;
  description: string;
  accent: string;
  icon: string;
  valid: boolean;
  error: string | null;
}

export interface CSVResult {
  rows: CSVRow[];
  errors: string[];
  total: number;
}

export interface CSVProgress {
  processed: number;
  total: number;
}

interface UseCSVImport {
  importCSV: (csv: string) => void;
  isProcessing: boolean;
  progress: CSVProgress | null;
  result: CSVResult | null;
  error: string | null;
  reset: () => void;
}

/**
 * Drives the CSV import Web Worker. Parsing runs off the main thread so a large
 * file never blocks the UI. The worker is created lazily and terminated on
 * unmount.
 */
export function useCSVImport(): UseCSVImport {
  const workerRef = useRef<Worker | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<CSVProgress | null>(null);
  const [result, setResult] = useState<CSVResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Terminate the worker when the component using this hook unmounts.
  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  const reset = useCallback(() => {
    setProgress(null);
    setResult(null);
    setError(null);
    setIsProcessing(false);
  }, []);

  const importCSV = useCallback((csv: string) => {
    // Recreate the worker per import so state never leaks between runs.
    workerRef.current?.terminate();
    const worker = new Worker('/workers/csv-import.worker.js');
    workerRef.current = worker;

    setIsProcessing(true);
    setProgress(null);
    setResult(null);
    setError(null);

    worker.onmessage = (e: MessageEvent) => {
      const { type, payload } = e.data || {};
      if (type === 'PROGRESS') {
        setProgress(payload as CSVProgress);
      } else if (type === 'PARSE_COMPLETE') {
        setResult(payload as CSVResult);
        setIsProcessing(false);
        worker.terminate();
        workerRef.current = null;
      } else if (type === 'PARSE_ERROR') {
        setError(payload?.message ?? 'Failed to parse CSV');
        setIsProcessing(false);
        worker.terminate();
        workerRef.current = null;
      }
    };

    worker.onerror = (e) => {
      setError(e.message || 'Worker error');
      setIsProcessing(false);
      worker.terminate();
      workerRef.current = null;
    };

    worker.postMessage({ type: 'PARSE_CSV', payload: csv });
  }, []);

  return { importCSV, isProcessing, progress, result, error, reset };
}

export default useCSVImport;
