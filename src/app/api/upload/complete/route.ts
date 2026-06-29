import { NextRequest, NextResponse } from 'next/server';
import { assemble, uploadedChunks } from '@/lib/upload-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const filename = String(body?.filename ?? '');
    const totalChunks = Number(body?.totalChunks);

    if (!filename || !Number.isInteger(totalChunks) || totalChunks <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid request' },
        { status: 400 },
      );
    }

    // Guard against assembling an incomplete upload.
    const present = await uploadedChunks(filename);
    if (present.length < totalChunks) {
      return NextResponse.json(
        {
          success: false,
          error: `Missing chunks: have ${present.length} of ${totalChunks}`,
        },
        { status: 409 },
      );
    }

    const url = await assemble(filename, totalChunks);
    return NextResponse.json({ success: true, url });
  } catch (err) {
    console.error('[api/upload/complete] error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to assemble file' },
      { status: 500 },
    );
  }
}
