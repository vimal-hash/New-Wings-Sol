import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type StockStatus = 'available' | 'limited' | 'on-request';

interface StockEntry {
  status: StockStatus;
  label: string;
  units: number;
}

// Base inventory per product. We don't have a real warehouse feed, so this is
// a deterministic baseline with a small live-feeling jitter applied per request.
const STOCK_TABLE: Record<string, StockEntry> = {
  galalite: { status: 'available', label: 'In Stock', units: 3 },
  christie: { status: 'limited', label: 'Limited Stock', units: 1 },
  leonis: { status: 'available', label: 'In Stock', units: 5 },
  ushio: { status: 'available', label: 'In Stock', units: 12 },
  sound: { status: 'on-request', label: 'Order Required', units: 0 },
  seating: { status: 'limited', label: 'Limited Stock', units: 2 },
};

const DEFAULT_ENTRY: StockEntry = {
  status: 'available',
  label: 'In Stock',
  units: 4,
};

export async function GET(
  _req: NextRequest,
  { params }: { params: { productId: string } },
) {
  const base = STOCK_TABLE[params.productId] ?? DEFAULT_ENTRY;

  // Small random variation so the badge feels "live" — occasionally drop a unit
  // (but never below zero, and never for the on-request items).
  let units = base.units;
  if (units > 0 && Math.random() < 0.35) {
    units = Math.max(0, units - 1);
  }

  return NextResponse.json(
    { status: base.status, label: base.label, units },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
