import type { APIRequestContext, APIResponse } from '@playwright/test';

export async function readJsonIfPresent<T>(response: APIResponse): Promise<T | undefined> {
  const contentType = response.headers()['content-type'] ?? '';
  if (!contentType.includes('application/json')) return undefined;
  return (await response.json()) as T;
}

/**
 * Petstore occasionally returns 5xx on DELETE; retry a few times with backoff.
 */
export async function deleteWithRetry(
  request: APIRequestContext,
  url: string,
  options?: { maxAttempts?: number; baseDelayMs?: number },
): Promise<APIResponse> {
  const maxAttempts = options?.maxAttempts ?? 4;
  const baseDelayMs = options?.baseDelayMs ?? 250;
  let last: APIResponse | undefined;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    last = await request.delete(url);
    if (last.ok() || last.status() === 404) return last;

    const retryable = last.status() >= 500 && last.status() < 600;
    if (retryable && attempt < maxAttempts - 1) {
      await new Promise((resolve) => setTimeout(resolve, baseDelayMs * (attempt + 1)));
      continue;
    }
    return last;
  }

  return last!;
}
