import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface User {
  username: string;
  passwordHash: string;
}

interface TokenPayload {
  username: string;
  iat: number;
  exp: number;
}

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';
const TOKEN_EXPIRY = '24h';

// in-memory user store
const users = new Map<string, User>();

// Pre-populate with demo user for testing
users.set('demo', {
  username: 'demo',
  passwordHash: bcrypt.hashSync('demo123', 10),
});

export async function registerUser(username: string, password: string): Promise<{ success: boolean; error?: string }> {
  if (!username || !password) {
    return { success: false, error: 'username and password required' };
  }
  if (username.length < 3) {
    return { success: false, error: 'username must be at least 3 characters' };
  }
  if (password.length < 6) {
    return { success: false, error: 'password must be at least 6 characters' };
  }
  if (users.has(username)) {
    return { success: false, error: 'username already exists' };
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  users.set(username, { username, passwordHash });
  return { success: true };
}

export async function loginUser(
  username: string,
  password: string,
): Promise<{ success: boolean; token?: string; error?: string }> {
  const user = users.get(username);
  if (!user) {
    return { success: false, error: 'invalid username or password' };
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return { success: false, error: 'invalid username or password' };
  }

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
  return { success: true, token };
}

export function verifyToken(token: string): { valid: boolean; username?: string; error?: string } {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return { valid: true, username: decoded.username };
  } catch (err: any) {
    return { valid: false, error: err.message };
  }
}

export function decodeToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.decode(token) as TokenPayload;
    return decoded;
  } catch {
    return null;
  }
}
