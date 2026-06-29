import { NextRequest, NextResponse } from 'next/server';
import { uploadedChunks } from '@/lib/upload-store';
import { getAdminSession } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  // Defence in depth beyond middleware: require a valid admin session.
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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
