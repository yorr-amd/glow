import { describe, it, expect } from 'vitest';

const mockRoutineData = {
  pagi: {
    title: "Rutin Pagi (Start Fresh & Glowing ☀️)",
    timeRange: "05:00 - 10:59",
    full: [
      { id: "p1", name: "Hydrating Body Lotion", desc: "Body lotion", category: "body", isEssential: true },
      { id: "p2", name: "Gentle Facial Cleanser", desc: "Cleanser", category: "face", isEssential: true },
      { id: "p3", name: "Daily Moisturizer", desc: "Moisturizer", category: "face", isEssential: true },
      { id: "p4", name: "Daily Lip Tint", desc: "Lip tint", category: "decorative", isEssential: false },
    ],
    quick: ["p1", "p2", "p3"]
  },
  siang: {
    title: "Rutin Siang",
    timeRange: "11:00 - 14:59",
    full: [
      { id: "si1", name: "Face Mist", desc: "Mist", category: "face", isEssential: true }
    ],
    quick: ["si1"]
  },
  sore: {
    title: "Rutin Sore",
    timeRange: "15:00 - 18:59",
    full: [
      { id: "s1", name: "Body Lotion", desc: "Lotion", category: "body", isEssential: true },
      { id: "s2", name: "Facial Cleanser", desc: "Cleanser", category: "face", isEssential: true }
    ],
    quick: ["s1"]
  },
  malam: {
    title: "Rutin Malam (Glow While You Sleep 🌙)",
    timeRange: "19:00 - 04:59",
    full: [
      { id: "m1", name: "Hydrating Body Lotion", desc: "Lotion", category: "body", isEssential: true },
      { id: "m2", name: "Gentle Facial Cleanser", desc: "Cleanser", category: "face", isEssential: true },
      { id: "m3", name: "Daily Moisturizer", desc: "Moisturizer", category: "face", isEssential: true },
      {
        id: "m6",
        name: "Custom Periodic Serum",
        desc: "Periodic treatment",
        category: "face",
        isEssential: false,
        scheduleType: "custom_days",
        scheduledDays: [1, 4], // Monday (1) & Thursday (4)
      },
      {
        id: "m7",
        name: "Exfoliating Toner",
        desc: "Toner",
        category: "body",
        isEssential: false,
        isConditional: true, // Legacy fallback: [3, 6]
      }
    ],
    quick: ["m1", "m2", "m3"]
  }
};

/**
 * Filter function implementing the exact App.jsx getActiveItems logic
 */
function getActiveItems({ mode, routineMode, tonerEnabled = true, todayDay = 3, data = mockRoutineData }) {
  const baseRoutine = data[mode] || data.sore;

  // 1. Quick mode vs Full mode item mapping
  let items = routineMode === 'quick'
    ? baseRoutine.full.filter((item) => (baseRoutine.quick || []).includes(item.id) || item.isEssential)
    : [...baseRoutine.full];

  // 2. Custom day filtering for periodic/conditional items
  items = items.filter((item) => {
    const isPeriodic =
      item.scheduleType === 'custom_days' ||
      (Array.isArray(item.scheduledDays) && item.scheduledDays.length < 7) ||
      item.isConditional;

    if (!isPeriodic) return true; // Daily items are always active

    const scheduledDays = Array.isArray(item.scheduledDays)
      ? item.scheduledDays
      : (item.isConditional ? [3, 6] : []);

    // Exclude if today is not in scheduled days
    if (!scheduledDays.includes(todayDay)) return false;

    // Respect toggle switch
    return tonerEnabled;
  });

  return items;
}

describe('Routine Item Filtering & Custom Periodic Scheduling', () => {
  describe('Quick Mode Item Mapping', () => {
    it('returns complete product objects with name, desc, and category in Quick Mode', () => {
      const items = getActiveItems({
        mode: 'pagi',
        routineMode: 'quick',
        tonerEnabled: false,
        todayDay: 1,
      });

      expect(items.length).toBeGreaterThan(0);
      items.forEach((item) => {
        expect(typeof item).toBe('object');
        expect(typeof item.id).toBe('string');
        expect(typeof item.name).toBe('string');
        expect(typeof item.category).toBe('string');
        expect(item.name.length).toBeGreaterThan(0);
      });
    });

    it('filters down to essential items in Quick Mode compared to Full Mode', () => {
      const quickItems = getActiveItems({
        mode: 'pagi',
        routineMode: 'quick',
        tonerEnabled: false,
        todayDay: 1,
      });

      const fullItems = getActiveItems({
        mode: 'pagi',
        routineMode: 'full',
        tonerEnabled: false,
        todayDay: 1,
      });

      expect(quickItems.length).toBeLessThan(fullItems.length);
      expect(quickItems.length).toBe(3); // p1, p2, p3
    });
  });

  describe('Custom Periodic Scheduling Rules', () => {
    it('INCLUDES custom periodic product on its scheduled day (e.g. Monday = 1)', () => {
      const items = getActiveItems({
        mode: 'malam',
        routineMode: 'full',
        tonerEnabled: true,
        todayDay: 1, // Monday
      });

      const hasCustom = items.some((i) => i.id === 'm6');
      expect(hasCustom).toBe(true);
    });

    it('EXCLUDES custom periodic product on unscheduled days (e.g. Tuesday = 2 or Wednesday = 3)', () => {
      const items = getActiveItems({
        mode: 'malam',
        routineMode: 'full',
        tonerEnabled: true,
        todayDay: 2, // Tuesday
      });

      const hasCustom = items.some((i) => i.id === 'm6');
      expect(hasCustom).toBe(false);
    });

    it('EXCLUDES scheduled product when user toggle is OFF (even on scheduled day)', () => {
      const items = getActiveItems({
        mode: 'malam',
        routineMode: 'full',
        tonerEnabled: false, // Toggle turned off
        todayDay: 1, // Monday
      });

      const hasCustom = items.some((i) => i.id === 'm6');
      expect(hasCustom).toBe(false);
    });

    it('supports backward-compatible conditional items defaulting to Wednesday (3) & Saturday (6)', () => {
      // Wednesday (3)
      const wedItems = getActiveItems({
        mode: 'malam',
        routineMode: 'full',
        tonerEnabled: true,
        todayDay: 3,
      });
      expect(wedItems.some((i) => i.id === 'm7')).toBe(true);

      // Friday (5)
      const friItems = getActiveItems({
        mode: 'malam',
        routineMode: 'full',
        tonerEnabled: true,
        todayDay: 5,
      });
      expect(friItems.some((i) => i.id === 'm7')).toBe(false);
    });

    it('ALWAYS includes daily routine items on any day', () => {
      for (const day of [0, 1, 2, 3, 4, 5, 6]) {
        const items = getActiveItems({
          mode: 'malam',
          routineMode: 'full',
          tonerEnabled: false,
          todayDay: day,
        });

        expect(items.some((i) => i.id === 'm1')).toBe(true);
        expect(items.some((i) => i.id === 'm2')).toBe(true);
        expect(items.some((i) => i.id === 'm3')).toBe(true);
      }
    });
  });
});
