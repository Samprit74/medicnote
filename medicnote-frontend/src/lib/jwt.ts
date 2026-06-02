/**
 * JWT helpers — purely functional, no React, no axios.
 */

export interface DecodedJwt {
  sub?: string;
  role?: string;
  userId?: number;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

export function parseJwt(token: string): DecodedJwt | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const json =
      typeof atob === "function"
        ? atob(padded)
        : Buffer.from(padded, "base64").toString("utf-8");
    return JSON.parse(json) as DecodedJwt;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const decoded = parseJwt(token);
  if (!decoded || !decoded.exp) return true;
  return Date.now() >= decoded.exp * 1000;
}
