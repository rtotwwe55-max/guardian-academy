import { NextResponse } from 'next/server';
import { getHistory, addHistory, clearHistory } from '@/lib/store'; // now async
import { verifyToken } from '@/lib/auth';

function extractToken(request: Request): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  return parts[1];
}

export async function GET(request: Request) {
  const token = extractToken(request);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const verify = verifyToken(token);
  if (!verify.valid) return NextResponse.json({ error: 'invalid token' }, { status: 401 });

  const history = await getHistory(verify.username!);
  return NextResponse.json({ history });
}

export async function POST(request: Request) {
  const token = extractToken(request);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const verify = verifyToken(token);
  if (!verify.valid) return NextResponse.json({ error: 'invalid token' }, { status: 401 });

  try {
    const { entry } = await request.json();
    if (!entry) {
      return NextResponse.json({ error: 'entry required' }, { status: 400 });
    }
    const updated = await addHistory(verify.username!, entry);
    return NextResponse.json({ history: updated });
  } catch (err) {
    return NextResponse.json({ error: 'invalid request' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const token = extractToken(request);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const verify = verifyToken(token);
  if (!verify.valid) return NextResponse.json({ error: 'invalid token' }, { status: 401 });

  await clearHistory(verify.username!);
  return NextResponse.json({ ok: true });
}
