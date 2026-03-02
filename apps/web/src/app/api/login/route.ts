import { NextResponse } from 'next/server';
import { createSession } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const { username } = await request.json();
    if (!username) {
      return NextResponse.json({ error: 'username required' }, { status: 400 });
    }
    const session = createSession(username);
    return NextResponse.json({ session });
  } catch (err) {
    return NextResponse.json({ error: 'invalid request' }, { status: 400 });
  }
}
