import { arrayToCSV } from '../../../../packages/core/src/csv';
import { v4 as uuidv4 } from 'uuid';

interface Entry {
  score: number;
  timestamp: string;
}

interface UserData {
  username: string;
  history: Entry[];
}

const users = new Map<string, UserData>();

export function createSession(username: string): string {
  const session = uuidv4();
  users.set(session, { username, history: [] });
  return session;
}

export function getHistory(session: string): Entry[] | null {
  const u = users.get(session);
  return u ? u.history : null;
}

export function addHistory(session: string, entry: Entry): Entry[] | null {
  const u = users.get(session);
  if (!u) return null;
  u.history.push(entry);
  return u.history;
}

export function clearHistory(session: string): boolean {
  const u = users.get(session);
  if (!u) return false;
  u.history = [];
  return true;
}

export function exportCSV(session: string): string | null {
  const h = getHistory(session);
  if (!h) return null;
  return arrayToCSV(h, ['timestamp', 'score']);
}
