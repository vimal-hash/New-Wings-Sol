import { formatPrice, debounce, fetchWithRetry } from '@/lib/performance';

describe('formatPrice', () => {
  it('formats 1500000 as ₹15,00,000 (Indian grouping)', () => {
    expect(formatPrice(1500000)).toBe('₹15,00,000');
  });

  it('formats 0 as ₹0', () => {
    expect(formatPrice(0)).toBe('₹0');
  });
});

describe('debounce', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('delays execution until the wait elapses', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 200);

    debounced();
    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(199);
    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('only fires once for rapid successive calls', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 100);
    debounced();
    debounced();
    debounced();
    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe('fetchWithRetry', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('retries on failure and resolves once fetch succeeds', async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 500 })
      .mockResolvedValueOnce({ ok: false, status: 503 })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ ok: true }) });
    global.fetch = fetchMock as unknown as typeof fetch;

    const promise = fetchWithRetry<{ ok: boolean }>('/api/test', undefined, 3);
    // Advance through the 1s and 2s backoff waits, flushing promises between.
    await jest.runAllTimersAsync();

    await expect(promise).resolves.toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('rejects after exhausting all retries', async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValue({ ok: false, status: 500 });
    global.fetch = fetchMock as unknown as typeof fetch;

    const promise = fetchWithRetry('/api/test', undefined, 3);
    // Attach the rejection handler before flushing timers to avoid an
    // unhandled-rejection warning.
    const assertion = expect(promise).rejects.toThrow('HTTP error: 500');
    await jest.runAllTimersAsync();
    await assertion;
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });
});
