import { NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    if (!username || !password) {
      return NextResponse.json({ error: 'username and password required' }, { status: 400 });
    }
    const result = await loginUser(username, password);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }
    return NextResponse.json({ token: result.token, username });
  } catch (err) {
    return NextResponse.json({ error: 'invalid request' }, { status: 400 });
  }
}
