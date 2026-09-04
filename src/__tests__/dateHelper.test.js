import { describe, it, expect } from 'vitest';
import { isExfoliatingDay, getCurrentDateString, getDateDaysAgo } from '../utils/dateHelper';

describe('dateHelper', () => {
  it('correctly formats local date as YYYY-MM-DD', () => {
    const testDate = new Date(2026, 8, 4); // September 4, 2026 (month is 0-indexed)
    expect(getCurrentDateString(testDate)).toBe('2026-09-04');
  });

  it('correctly calculates days ago in local timezone', () => {
    const baseDate = new Date(2026, 8, 4); // September 4, 2026
    expect(getDateDaysAgo(1, baseDate)).toBe('2026-09-03');
    expect(getDateDaysAgo(3, baseDate)).toBe('2026-09-01');
    expect(getDateDaysAgo(5, baseDate)).toBe('2026-08-30');
  });

  it('identifies Wednesday (day 3) and Saturday (day 6) as exfoliating days', () => {
    // 2026-09-02 is Wednesday (day 3)
    const wednesday = new Date(2026, 8, 2);
    expect(wednesday.getDay()).toBe(3);
    expect(isExfoliatingDay(wednesday)).toBe(true);

    // 2026-09-05 is Saturday (day 6)
    const saturday = new Date(2026, 8, 5);
    expect(saturday.getDay()).toBe(6);
    expect(isExfoliatingDay(saturday)).toBe(true);
  });

  it('identifies Sunday, Monday, Tuesday, Thursday, Friday as non-exfoliating days', () => {
    const sunday = new Date(2026, 7, 30); // day 0
    const monday = new Date(2026, 7, 31); // day 1
    const tuesday = new Date(2026, 8, 1); // day 2
    const thursday = new Date(2026, 8, 3); // day 4
    const friday = new Date(2026, 8, 4); // day 5

    expect(isExfoliatingDay(sunday)).toBe(false);
    expect(isExfoliatingDay(monday)).toBe(false);
    expect(isExfoliatingDay(tuesday)).toBe(false);
    expect(isExfoliatingDay(thursday)).toBe(false);
    expect(isExfoliatingDay(friday)).toBe(false);
  });
});
