import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { chunkDirFor, chunkPath, ensureDir } from '@/lib/upload-store';
import { getAdminSession } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// The client uploads in 1 MB chunks; cap server-side at 2 MB to allow headroom
// while rejecting oversized payloads that could exhaust disk/memory.
const MAX_CHUNK_BYTES = 2 * 1024 * 1024;

export async function POST(req: NextRequest) {
  // Defence in depth: middleware already blocks unauthenticated requests, but
  // we re-check here so the handler can never run without a valid admin session.
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const form = await req.formData();
    const chunk = form.get('chunk');
    const filename = String(form.get('filename') ?? '');
    const chunkIndex = Number(form.get('chunkIndex'));

    if (
      !(chunk instanceof Blob) ||
      !filename ||
      !Number.isInteger(chunkIndex) ||
      chunkIndex < 0
    ) {
      return NextResponse.json(
        { success: false, error: 'Invalid chunk payload' },
        { status: 400 },
      );
    }

    if (chunk.size > MAX_CHUNK_BYTES) {
      return NextResponse.json(
        { success: false, error: 'Chunk exceeds maximum allowed size' },
        { status: 413 },
      );
    }

    await ensureDir(chunkDirFor(filename));
    const buffer = Buffer.from(await chunk.arrayBuffer());
    await fs.writeFile(chunkPath(filename, chunkIndex), buffer);

    return NextResponse.json({ success: true, chunkIndex });
  } catch (err) {
    console.error('[api/upload/chunk] error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to store chunk' },
      { status: 500 },
    );
  }
}
