'use client';

import { useEffect, useRef, useState } from 'react';
import {
  UploadCloud,
  File as FileIcon,
  CheckCircle2,
  X,
  Loader2,
  RotateCcw,
} from 'lucide-react';
import {
  useChunkedUpload,
  listIncompleteUploads,
  clearStored,
  type StoredUpload,
} from '@/hooks/useChunkedUpload';

const MAX_SIZE = 500 * 1024 * 1024; // 500 MB
const ACCEPTED = ['image/', 'video/mp4', 'video/quicktime'];

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isAccepted(type: string): boolean {
  return ACCEPTED.some((a) =>
    a.endsWith('/') ? type.startsWith(a) : type === a,
  );
}

export default function RenovationUpload() {
  const { upload, progress, isUploading, error, fileUrl, reset } =
    useChunkedUpload();
  const [file, setFile] = useState<File | null>(null);
  const [sizeError, setSizeError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [incomplete, setIncomplete] = useState<StoredUpload[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // On mount, surface any incomplete uploads saved from a previous session.
  useEffect(() => {
    setIncomplete(listIncompleteUploads());
  }, []);

  // Once an upload finishes, drop it from the resume list.
  useEffect(() => {
    if (fileUrl) setIncomplete(listIncompleteUploads());
  }, [fileUrl]);

  const acceptFile = (f: File) => {
    reset();
    setSizeError(null);
    if (!isAccepted(f.type)) {
      setSizeError('Unsupported file type. Use an image, MP4, or MOV file.');
      return;
    }
    if (f.size > MAX_SIZE) {
      setSizeError(
        `File is ${formatSize(f.size)} — exceeds the 500 MB limit.`,
      );
      return;
    }
    setFile(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) acceptFile(f);
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) acceptFile(f);
  };

  const dismissResume = (filename: string) => {
    clearStored(filename);
    setIncomplete(listIncompleteUploads());
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      <div className="flex items-center gap-2 mb-5">
        <UploadCloud className="w-5 h-5 text-lavender-400" />
        <h2 className="text-lg font-semibold">Renovation Photos &amp; Videos</h2>
        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-lavender-500/20 text-lavender-300">
          Chunked · Resumable
        </span>
      </div>

      {/* Resume banner */}
      {incomplete.length > 0 && (
        <div className="mb-5 space-y-2">
          {incomplete.map((u) => (
            <div
              key={u.filename}
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-200 text-sm"
            >
              <span className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Resume previous upload?{' '}
                <strong className="font-medium">{u.filename}</strong> (
                {u.uploaded.length}/{u.totalChunks} chunks · {formatSize(u.size)})
                — re-select the same file to continue.
              </span>
              <button
                type="button"
                onClick={() => dismissResume(u.filename)}
                className="text-yellow-200/70 hover:text-yellow-100"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex flex-col items-center justify-center gap-3 px-6 py-12 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
          isDragging
            ? 'border-lavender-400 bg-lavender-500/10'
            : 'border-white/15 hover:border-white/30'
        }`}
      >
        <UploadCloud className="w-10 h-10 text-white/40" />
        <p className="text-sm text-white/70">
          Drag &amp; drop a photo or video here, or{' '}
          <span className="text-lavender-300 underline">browse</span>
        </p>
        <p className="text-xs text-white/40">
          Images, MP4, MOV — up to 500&nbsp;MB
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/mp4,video/quicktime"
          onChange={handleSelect}
          className="hidden"
        />
      </div>

      {sizeError && (
        <div className="mt-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          {sizeError}
        </div>
      )}

      {/* Selected file + upload */}
      {file && !sizeError && (
        <div className="mt-5">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3 min-w-0">
              <FileIcon className="w-5 h-5 text-white/50 shrink-0" />
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{file.name}</div>
                <div className="text-xs text-white/50">
                  {formatSize(file.size)}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => upload(file)}
              disabled={isUploading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-lavender-500 hover:bg-lavender-600 text-white text-sm font-medium disabled:opacity-50 transition-colors shrink-0"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Uploading…
                </>
              ) : (
                'Upload'
              )}
            </button>
          </div>

          {/* Progress bar */}
          {(isUploading || progress.percentage > 0) && !fileUrl && (
            <div>
              <div className="flex items-center justify-between text-xs text-white/60 mb-1.5">
                <span>
                  {progress.uploaded} / {progress.total} chunks
                </span>
                <span>{progress.percentage}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-lavender-500 to-cobalt-500 transition-all"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Success */}
      {fileUrl && (
        <div className="mt-5 flex items-center gap-2 px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>
            Upload complete —{' '}
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline break-all"
            >
              {fileUrl}
            </a>
          </span>
        </div>
      )}
    </section>
  );
}
