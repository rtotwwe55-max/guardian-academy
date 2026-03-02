import { NextResponse } from 'next/server';
import { getHistory, addHistory, clearHistory } from '@/lib/store';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const session = url.searchParams.get('session');
  if (!session) return NextResponse.json({ error: 'session required' }, { status: 400 });
  const history = getHistory(session);
  if (history === null) return NextResponse.json({ error: 'invalid session' }, { status: 404 });
  return NextResponse.json({ history });
}

export async function POST(request: Request) {
  try {
    const { session, entry } = await request.json();
    if (!session || !entry) {
      return NextResponse.json({ error: 'session and entry required' }, { status: 400 });
    }
    const updated = addHistory(session, entry);
    if (updated === null) return NextResponse.json({ error: 'invalid session' }, { status: 404 });
    return NextResponse.json({ history: updated });
  } catch (err) {
    return NextResponse.json({ error: 'invalid request' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const session = url.searchParams.get('session');
  if (!session) return NextResponse.json({ error: 'session required' }, { status: 400 });
  const success = clearHistory(session);
  if (!success) return NextResponse.json({ error: 'invalid session' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
