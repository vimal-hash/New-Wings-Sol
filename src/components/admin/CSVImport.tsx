'use client';

import { useRef, useState } from 'react';
import { Upload, Download, FileText, Check, X, Loader2 } from 'lucide-react';
import { useCSVImport } from '@/hooks/useCSVImport';

const TEMPLATE_CSV = `id,name,tagline,description,accent,icon
test1,Test Projector,Amazing quality,Full HD 4K projector for modern cinemas,coral,Projector
test2,Test Screen,Crystal clear,High gain silver screen,cobalt,Monitor`;

export default function CSVImport() {
  const { importCSV, isProcessing, progress, result, error, reset } =
    useCSVImport();
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setFileName(file.name);
    reset();
    const reader = new FileReader();
    reader.onload = () => importCSV(String(reader.result ?? ''));
    reader.onerror = () => importCSV('');
    reader.readAsText(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const downloadTemplate = () => {
    const blob = new Blob([TEMPLATE_CSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nw-products-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const pct =
    progress && progress.total > 0
      ? Math.round((progress.processed / progress.total) * 100)
      : 0;

  const validCount = result?.rows.filter((r) => r.valid).length ?? 0;

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-cobalt-400" />
          <h2 className="text-lg font-semibold">Bulk Product Import (CSV)</h2>
          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-cobalt-500/20 text-cobalt-300">
            Web Worker
          </span>
        </div>
        <button
          type="button"
          onClick={downloadTemplate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/15 text-sm text-white/80 hover:bg-white/5 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download template
        </button>
      </div>

      {/* File input */}
      <div className="flex items-center gap-3 mb-5">
        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          onChange={handleChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isProcessing}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-cobalt-500 hover:bg-cobalt-600 text-white text-sm font-medium disabled:opacity-50 transition-colors"
        >
          <Upload className="w-4 h-4" />
          Choose CSV file
        </button>
        {fileName && (
          <span className="text-sm text-white/60 truncate">{fileName}</span>
        )}
      </div>

      {/* Progress bar */}
      {isProcessing && (
        <div className="mb-5">
          <div className="flex items-center gap-2 text-sm text-white/70 mb-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Parsing… {progress?.processed ?? 0} / {progress?.total ?? 0}
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cobalt-500 to-lavender-500 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="mb-5 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div>
          <div className="flex flex-wrap gap-4 mb-4 text-sm">
            <span className="text-white/70">
              Total: <strong className="text-white">{result.total}</strong>
            </span>
            <span className="text-emerald-300">Valid: {validCount}</span>
            <span className="text-red-300">
              Invalid: {result.total - validCount}
            </span>
          </div>

          <div className="rounded-xl border border-white/10 overflow-hidden overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-white/50 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Tagline</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {result.rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-8 text-center text-white/40"
                    >
                      No data rows found.
                    </td>
                  </tr>
                ) : (
                  result.rows.map((row, i) => (
                    <tr
                      key={`${row.id || 'row'}-${i}`}
                      className="border-t border-white/10"
                    >
                      <td className="px-4 py-3 font-medium">
                        {row.name || (
                          <span className="text-white/30">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-white/70">
                        {row.tagline || '—'}
                      </td>
                      <td className="px-4 py-3">
                        {row.valid ? (
                          <span className="inline-flex items-center gap-1.5 text-emerald-300">
                            <Check className="w-4 h-4" /> Valid
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1.5 text-red-300"
                            title={row.error ?? undefined}
                          >
                            <X className="w-4 h-4" /> Invalid
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
