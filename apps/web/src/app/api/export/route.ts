import { NextResponse } from 'next/server';
import { exportCSV } from '@/lib/store';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const session = url.searchParams.get('session');
  if (!session) return NextResponse.json({ error: 'session required' }, { status: 400 });
  const csv = exportCSV(session);
  if (csv === null) return NextResponse.json({ error: 'invalid session' }, { status: 404 });
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="export.csv"',
    },
  });
}
