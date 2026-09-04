import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { calculateStreak } from '../components/StreakCounter';

describe('StreakCounter - calculateStreak', () => {
  beforeEach(() => {
    // Set fixed system time: Friday, 2026-09-04 12:00:00
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 4, 12, 0, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns 0 when history is empty or null', () => {
    expect(calculateStreak([])).toBe(0);
    expect(calculateStreak(null)).toBe(0);
    expect(calculateStreak(undefined)).toBe(0);
  });

  it('returns 1 when user checked only today', () => {
    expect(calculateStreak(['2026-09-04'])).toBe(1);
  });

  it('returns consecutive count when checked today and past consecutive days', () => {
    const history = ['2026-09-04', '2026-09-03', '2026-09-02'];
    expect(calculateStreak(history)).toBe(3);
  });

  it('maintains streak if user checked yesterday but has not yet checked today', () => {
    // Today is 2026-09-04, user checked yesterday (2026-09-03) and before
    const history = ['2026-09-03', '2026-09-02', '2026-09-01'];
    expect(calculateStreak(history)).toBe(3);
  });

  it('RESETS streak to 0 if even 1 day was skipped (AGENTS.md Strict Rule 2)', () => {
    // Skipped yesterday (2026-09-03), last check was 2026-09-02
    const historyWithGap = ['2026-09-02', '2026-09-01'];
    expect(calculateStreak(historyWithGap)).toBe(0);
  });

  it('stops counting at the first gap', () => {
    // Today (04), yesterday (03), gap on 02, then older days (01, 31)
    const history = ['2026-09-04', '2026-09-03', '2026-09-01', '2026-08-31'];
    expect(calculateStreak(history)).toBe(2);
  });

  it('handles duplicate and unsorted history entries properly', () => {
    const history = ['2026-09-02', '2026-09-04', '2026-09-03', '2026-09-04', '2026-09-03'];
    expect(calculateStreak(history)).toBe(3);
  });
});
