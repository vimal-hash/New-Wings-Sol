import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';

// Temp staging area for in-flight chunks (cross-platform — not a hardcoded /tmp).
const CHUNK_ROOT = path.join(os.tmpdir(), 'nw-chunks');

// Final assembled files live under public/uploads so the returned URL resolves.
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

/**
 * Reduce an untrusted filename to a safe basename — strips any directory
 * components and disallows traversal characters, preventing path-escape writes.
 */
export function sanitizeName(filename: string): string {
  const base = path.basename(filename || '');
  const cleaned = base.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/^\.+/, '');
  return cleaned || 'upload.bin';
}

export function chunkDirFor(filename: string): string {
  return path.join(CHUNK_ROOT, sanitizeName(filename));
}

export function chunkPath(filename: string, index: number): string {
  return path.join(chunkDirFor(filename), `${index}.part`);
}

export async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
}

/** Returns the sorted list of chunk indexes already on disk for a filename. */
export async function uploadedChunks(filename: string): Promise<number[]> {
  const dir = chunkDirFor(filename);
  try {
    const entries = await fs.readdir(dir);
    return entries
      .filter((e) => e.endsWith('.part'))
      .map((e) => parseInt(e.replace('.part', ''), 10))
      .filter((n) => Number.isInteger(n))
      .sort((a, b) => a - b);
  } catch {
    // Directory doesn't exist yet → nothing uploaded.
    return [];
  }
}

/**
 * Concatenate chunks 0..totalChunks-1 into the final file under public/uploads,
 * then remove the staging directory. Returns the public URL path.
 */
export async function assemble(
  filename: string,
  totalChunks: number,
): Promise<string> {
  const safe = sanitizeName(filename);
  await ensureDir(UPLOADS_DIR);
  const finalPath = path.join(UPLOADS_DIR, safe);

  const handle = await fs.open(finalPath, 'w');
  try {
    for (let i = 0; i < totalChunks; i++) {
      const data = await fs.readFile(chunkPath(filename, i));
      await handle.write(data);
    }
  } finally {
    await handle.close();
  }

  // Clean up the staging chunks.
  await fs.rm(chunkDirFor(filename), { recursive: true, force: true });

  return `/uploads/${safe}`;
}
