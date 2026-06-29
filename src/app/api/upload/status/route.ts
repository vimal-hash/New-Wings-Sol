import { NextRequest, NextResponse } from 'next/server';
import { uploadedChunks } from '@/lib/upload-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const filename = req.nextUrl.searchParams.get('filename');
  if (!filename) {
    return NextResponse.json(
      { uploadedChunks: [], error: 'filename is required' },
      { status: 400 },
    );
  }

  const chunks = await uploadedChunks(filename);
  return NextResponse.json(
    { uploadedChunks: chunks },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
