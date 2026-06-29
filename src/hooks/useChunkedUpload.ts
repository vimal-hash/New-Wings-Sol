'use client';

import { useCallback, useRef, useState } from 'react';

const CHUNK_SIZE = 1024 * 1024; // 1 MB
const RETRY_DELAYS = [2000, 4000, 8000]; // exponential backoff, capped at 8s
export const STORAGE_PREFIX = 'upload_progress_';

export interface UploadProgress {
  uploaded: number;
  total: number;
  percentage: number;
}

export interface StoredUpload {
  filename: string;
  size: number;
  totalChunks: number;
  uploaded: number[];
}

interface UseChunkedUpload {
  upload: (file: File) => Promise<void>;
  progress: UploadProgress;
  isUploading: boolean;
  error: string | null;
  fileUrl: string | null;
  reset: () => void;
}

const storageKey = (filename: string) => `${STORAGE_PREFIX}${filename}`;

function writeStored(record: StoredUpload) {
  try {
    localStorage.setItem(storageKey(record.filename), JSON.stringify(record));
  } catch {
    /* storage full / unavailable — non-fatal */
  }
}

/** Remove the saved progress entry for a filename. */
export function clearStored(filename: string) {
  try {
    localStorage.removeItem(storageKey(filename));
  } catch {
    /* ignore */
  }
}

/** List all incomplete uploads saved in localStorage. */
export function listIncompleteUploads(): StoredUpload[] {
  const out: StoredUpload[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        const raw = localStorage.getItem(key);
        if (raw) out.push(JSON.parse(raw) as StoredUpload);
      }
    }
  } catch {
    /* ignore */
  }
  return out;
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function useChunkedUpload(): UseChunkedUpload {
  const [progress, setProgress] = useState<UploadProgress>({
    uploaded: 0,
    total: 0,
    percentage: 0,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const abortRef = useRef(false);

  const reset = useCallback(() => {
    abortRef.current = false;
    setProgress({ uploaded: 0, total: 0, percentage: 0 });
    setIsUploading(false);
    setError(null);
    setFileUrl(null);
  }, []);

  // Upload a single chunk, retrying with exponential backoff on failure.
  const uploadChunk = useCallback(
    async (file: File, index: number, totalChunks: number) => {
      const start = index * CHUNK_SIZE;
      const blob = file.slice(start, start + CHUNK_SIZE);

      for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
        try {
          const form = new FormData();
          form.append('chunk', blob);
          form.append('chunkIndex', String(index));
          form.append('filename', file.name);
          form.append('totalChunks', String(totalChunks));

          const res = await fetch('/api/upload/chunk', {
            method: 'POST',
            body: form,
          });
          if (!res.ok) throw new Error(`Chunk ${index} failed (${res.status})`);
          return;
        } catch (err) {
          // Out of retries — rethrow so the caller can surface the error.
          if (attempt === RETRY_DELAYS.length) throw err;
          await delay(RETRY_DELAYS[attempt]);
        }
      }
    },
    [],
  );

  const upload = useCallback(
    async (file: File) => {
      abortRef.current = false;
      setIsUploading(true);
      setError(null);
      setFileUrl(null);

      const totalChunks = Math.max(1, Math.ceil(file.size / CHUNK_SIZE));

      try {
        // 1. Ask the server which chunks already exist (resume support).
        let alreadyUploaded: number[] = [];
        try {
          const res = await fetch(
            `/api/upload/status?filename=${encodeURIComponent(file.name)}`,
          );
          if (res.ok) {
            const data = await res.json();
            alreadyUploaded = Array.isArray(data.uploadedChunks)
              ? data.uploadedChunks
              : [];
          }
        } catch {
          // Status check is best-effort; fall back to uploading everything.
        }

        const done = new Set<number>(alreadyUploaded);
        setProgress({
          uploaded: done.size,
          total: totalChunks,
          percentage: Math.round((done.size / totalChunks) * 100),
        });
        writeStored({
          filename: file.name,
          size: file.size,
          totalChunks,
          uploaded: Array.from(done),
        });

        // 2. Upload the remaining chunks sequentially.
        for (let i = 0; i < totalChunks; i++) {
          if (abortRef.current) return;
          if (done.has(i)) continue;

          await uploadChunk(file, i, totalChunks);
          done.add(i);

          setProgress({
            uploaded: done.size,
            total: totalChunks,
            percentage: Math.round((done.size / totalChunks) * 100),
          });
          writeStored({
            filename: file.name,
            size: file.size,
            totalChunks,
            uploaded: Array.from(done),
          });
        }

        // 3. Tell the server to assemble the final file.
        const completeRes = await fetch('/api/upload/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, totalChunks }),
        });
        if (!completeRes.ok) throw new Error('Failed to finalize upload');

        const { url } = await completeRes.json();
        clearStored(file.name);
        setFileUrl(url);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed');
      } finally {
        setIsUploading(false);
      }
    },
    [uploadChunk],
  );

  return { upload, progress, isUploading, error, fileUrl, reset };
}

export default useChunkedUpload;
