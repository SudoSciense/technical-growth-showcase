export interface RetryOptions {
  maxRetries: number;
  initialDelayMs: number;
  backoffFactor?: number;
  maxDelayMs?: number;
  jitter?: boolean;
  shouldRetry?: (error: unknown) => boolean;
}
/** *
 * Retries a function with exponential backoff and jitter. This prevents overwhelming a service with retries 
 * and helps to avoid thundering herd problems upon service recovery. In short, a horizonally scaled service that is
 * trying to not overwhelm a downstream service that is recovering from a failure should use this function to retry 
 * requests to the downstream service.
 * @param fn The function to retry.
 * @param options The retry options.
 * @returns A promise resolving to the result of the function or rejecting with the last error.
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  const {
    maxRetries,
    initialDelayMs,
    backoffFactor = 2,
    maxDelayMs = Infinity,
    jitter = true,
    shouldRetry,
  } = options;

  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: unknown) {
      lastError = error;

      // Halt immediately if retries exhausted or predicate explicitly rejects
      if (attempt >= maxRetries || (shouldRetry && !shouldRetry(error))) {
        throw error;
      }

      // Compute new delay. Either the exponential backoff or the max delay, whichever is smaller.
      const calculatedCeiling = Math.min(
        initialDelayMs * Math.pow(backoffFactor, attempt),
        maxDelayMs
      );

      // Apply jitter if enabled.
      const sleepDurationMs = jitter
        ? Math.floor(Math.random() * (calculatedCeiling + 1))
        : calculatedCeiling;

      await new Promise<void>((resolve) => setTimeout(resolve, sleepDurationMs));
    }
  }

  // If we exit the loop without returning, it means all retries failed. Throw the last error.
  throw lastError;
}