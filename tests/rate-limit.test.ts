/**
 * §6 rate limiting — 120/min /health, 60/min /api/content, 300/min general.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { checkRateLimit, limitFor, resetRateLimitsForTests } from '../src/lib/rate-limit';

beforeEach(() => resetRateLimitsForTests());

describe('limitFor', () => {
  it('classifies the three §6 limit classes', () => {
    expect(limitFor('/health').max).toBe(120);
    expect(limitFor('/api/content').max).toBe(60);
    expect(limitFor('/').max).toBe(300);
    expect(limitFor('/status').max).toBe(300);
  });
});

describe('checkRateLimit', () => {
  it('allows up to the limit and rejects the next request with a Retry-After', () => {
    for (let i = 0; i < 60; i++) {
      expect(checkRateLimit('1.2.3.4', '/api/content').allowed).toBe(true);
    }
    const over = checkRateLimit('1.2.3.4', '/api/content');
    expect(over.allowed).toBe(false);
    expect(over.retryAfterSeconds).toBeGreaterThan(0);
    expect(over.retryAfterSeconds).toBeLessThanOrEqual(60);
  });

  it('tracks IPs independently', () => {
    for (let i = 0; i < 60; i++) checkRateLimit('1.1.1.1', '/api/content');
    expect(checkRateLimit('1.1.1.1', '/api/content').allowed).toBe(false);
    expect(checkRateLimit('2.2.2.2', '/api/content').allowed).toBe(true);
  });

  it('tracks limit classes independently for one IP', () => {
    for (let i = 0; i < 60; i++) checkRateLimit('3.3.3.3', '/api/content');
    expect(checkRateLimit('3.3.3.3', '/api/content').allowed).toBe(false);
    expect(checkRateLimit('3.3.3.3', '/health').allowed).toBe(true);
    expect(checkRateLimit('3.3.3.3', '/').allowed).toBe(true);
  });
});
