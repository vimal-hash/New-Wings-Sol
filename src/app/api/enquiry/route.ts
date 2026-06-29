import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { quoteSchema } from '@/lib/enquiry-schema';
import { sendEnquiryEmail } from '@/lib/email';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Light per-IP throttle so the public form can't be used to spam the inbox.
// In-memory (per server instance) — enough to blunt obvious abuse.
const MAX_PER_WINDOW = 5;
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const hits = new Map<string, { count: number; resetTime: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = hits.get(ip);
  if (!bucket || bucket.resetTime <= now) {
    hits.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return false;
  }
  bucket.count += 1;
  return bucket.count > MAX_PER_WINDOW;
}

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0]!.trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}

export async function POST(req: NextRequest) {
  if (rateLimited(clientIp(req))) {
    return NextResponse.json(
      { success: false, error: 'Too many requests. Please try again later.' },
      { status: 429 },
    );
  }

  // Validate the payload server-side (never trust the client).
  let parsed;
  try {
    parsed = quoteSchema.safeParse(await req.json());
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request' },
      { status: 400 },
    );
  }
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Invalid form data' },
      { status: 400 },
    );
  }

  const values = parsed.data;

  // Persist the lead with the service-role client (bypasses RLS, server-only).
  const supabase = createAdminClient();
  const { error } = await supabase.from('quotes').insert({
    name: values.name,
    email: values.email,
    company: values.company,
    theatre: values.theatre || null,
    message: values.message,
    budget: values.budget ?? null,
  });

  if (error) {
    console.error('[api/enquiry] insert failed:', error.message);
    return NextResponse.json(
      { success: false, error: 'Could not submit. Please try again.' },
      { status: 500 },
    );
  }

  // Email a copy to the business inbox. Failure here never blocks the response —
  // the lead is already saved and visible in the admin dashboard.
  const emailed = await sendEnquiryEmail(values);

  return NextResponse.json({ success: true, emailed });
}
