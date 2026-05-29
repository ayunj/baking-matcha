const SESSION_KEY = "baking-matcha-session";

export type StoredSession = {
  id: string;
  dbId: string;
  name: string;
};

export function saveSession(session: StoredSession): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function loadSession(): StoredSession | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as StoredSession;
    if (parsed.id && parsed.dbId && parsed.name) return parsed;
  } catch {
    /* ignore */
  }
  return null;
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
}
