/**
 * Safely parses a fetch Response as JSON, returning a fallback instead of
 * throwing if the body is empty or malformed — which happens when a
 * server route crashes before returning its intended JSON response
 * (Vercel/Next.js can return an empty body in that case). Without this,
 * `await res.json()` throws "Unexpected end of JSON input" and the
 * actual problem (a broken server response) gets hidden behind a
 * confusing client-side parse error instead of a clear message.
 */
export async function safeJson<T = Record<string, unknown>>(
  res: Response,
  fallback: T
): Promise<T> {
  try {
    const text = await res.text();
    if (!text) return fallback;
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}
