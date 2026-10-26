import { afterEach, describe, expect, it, vi } from 'vitest';
import { retryWithBackoff } from './retryWithBackoff';

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

// Helper function to advance the fake timers and ensure that the retry delay has been processed
async function advanceRetryDelay(delayMs: number): Promise<void> {
  await Promise.resolve();
  expect(vi.getTimerCount()).toBe(1);
  await vi.advanceTimersByTimeAsync(delayMs);
}

describe('retryWithBackoff', () => {
  it('returns the result after the first successful attempt', async () => {
    const operation = vi.fn().mockResolvedValue('success');

    await expect(
      retryWithBackoff(operation, { maxRetries: 3, initialDelayMs: 100 })
    ).resolves.toBe('success');

    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('retries with the default exponential backoff and resolves with the first successful result', async () => {
    vi.useFakeTimers();
    const operation = vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(new Error('first failure'))
      .mockRejectedValueOnce(new Error('second failure'))
      .mockResolvedValue('success');
    const result = retryWithBackoff(operation, {
      maxRetries: 2,
      initialDelayMs: 10,
      jitter: false,
    });

    await advanceRetryDelay(10);
    expect(operation).toHaveBeenCalledTimes(2);
    await advanceRetryDelay(20);

    await expect(result).resolves.toBe('success');
    expect(operation).toHaveBeenCalledTimes(3);
  });

  it('makes at most maxRetries plus one attempts and preserves the final rejection', async () => {
    vi.useFakeTimers();
    const firstError = new Error('first failure');
    const finalError = new Error('final failure');
    const operation = vi
      .fn<() => Promise<never>>()
      .mockRejectedValueOnce(firstError)
      .mockRejectedValueOnce(new Error('second failure'))
      .mockRejectedValue(finalError);
    const result = retryWithBackoff(operation, {
      maxRetries: 2,
      initialDelayMs: 10,
      jitter: false,
    });
    const rejection = expect(result).rejects.toBe(finalError);

    await advanceRetryDelay(10);
    await advanceRetryDelay(20);

    await rejection;
    expect(operation).toHaveBeenCalledTimes(3);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('does not retry or wait when maxRetries is zero', async () => {
    vi.useFakeTimers();
    const error = new Error('failure');
    const operation = vi.fn().mockRejectedValue(error);

    await expect(
      retryWithBackoff(operation, {
        maxRetries: 0,
        initialDelayMs: 10,
      })
    ).rejects.toBe(error);

    expect(operation).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('stops immediately when shouldRetry rejects an error', async () => {
    vi.useFakeTimers();
    const error = new Error('non-retryable');
    const operation = vi.fn().mockRejectedValue(error);
    const shouldRetry = vi.fn().mockReturnValue(false);

    await expect(
      retryWithBackoff(operation, {
        maxRetries: 3,
        initialDelayMs: 10,
        shouldRetry,
      })
    ).rejects.toBe(error);

    expect(operation).toHaveBeenCalledTimes(1);
    expect(shouldRetry).toHaveBeenCalledExactlyOnceWith(error);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('retries when shouldRetry accepts the error', async () => {
    vi.useFakeTimers();
    const error = new Error('temporary failure');
    const operation = vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(error)
      .mockResolvedValue('success');
    const shouldRetry = vi.fn().mockReturnValue(true);
    const result = retryWithBackoff(operation, {
      maxRetries: 1,
      initialDelayMs: 10,
      jitter: false,
      shouldRetry,
    });

    await advanceRetryDelay(10);

    await expect(result).resolves.toBe('success');
    expect(operation).toHaveBeenCalledTimes(2);
    expect(shouldRetry).toHaveBeenCalledExactlyOnceWith(error);
  });

  it('uses the configured backoff factor and caps delays at maxDelayMs', async () => {
    vi.useFakeTimers();
    const operation = vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(new Error('first failure'))
      .mockRejectedValueOnce(new Error('second failure'))
      .mockRejectedValueOnce(new Error('third failure'))
      .mockResolvedValue('success');
    const result = retryWithBackoff(operation, {
      maxRetries: 3,
      initialDelayMs: 10,
      backoffFactor: 3,
      maxDelayMs: 25,
      jitter: false,
    });

    await advanceRetryDelay(10);
    await advanceRetryDelay(25);
    await advanceRetryDelay(25);

    await expect(result).resolves.toBe('success');
  });

  it('uses the exact calculated ceiling when jitter is disabled', async () => {
    vi.useFakeTimers();
    const random = vi.spyOn(Math, 'random');
    const operation = vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(new Error('temporary failure'))
      .mockResolvedValue('success');
    const result = retryWithBackoff(operation, {
      maxRetries: 1,
      initialDelayMs: 10,
      jitter: false,
    });

    await advanceRetryDelay(10);

    await expect(result).resolves.toBe('success');
    expect(random).not.toHaveBeenCalled();
  });

  it('can select zero as the jittered delay', async () => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const operation = vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(new Error('temporary failure'))
      .mockResolvedValue('success');
    const result = retryWithBackoff(operation, {
      maxRetries: 1,
      initialDelayMs: 10,
    });

    await advanceRetryDelay(0);

    await expect(result).resolves.toBe('success');
  });

  it('can select the calculated ceiling as the jittered delay', async () => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0.999999);
    const operation = vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(new Error('temporary failure'))
      .mockResolvedValue('success');
    const result = retryWithBackoff(operation, {
      maxRetries: 1,
      initialDelayMs: 10,
    });

    await advanceRetryDelay(10);

    await expect(result).resolves.toBe('success');
  });
});
