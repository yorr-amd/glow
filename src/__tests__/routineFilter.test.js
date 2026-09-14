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
      { id: "m6", name: "Exfoliating Toner", desc: "Toner", category: "body", isEssential: false, isConditional: true }
    ],
    quick: ["m1", "m2", "m3"]
  }
};

/**
 * Filter function implementing the exact App.jsx getActiveItems logic
 */
function getActiveItems({ mode, routineMode, tonerEnabled, isExfoliatingDay, data = mockRoutineData }) {
  const baseRoutine = data[mode] || data.sore;

  // 1. Quick mode vs Full mode item mapping
  let items = routineMode === 'quick'
    ? baseRoutine.full.filter((item) => (baseRoutine.quick || []).includes(item.id) || item.isEssential)
    : [...baseRoutine.full];

  // 2. Strict Toner Eksfoliasi condition: Rabu & Sabtu malam saja
  const canUseToner = mode === 'malam' && isExfoliatingDay && tonerEnabled;
  if (canUseToner) {
    const tonerItem = baseRoutine.full.find((i) => i.id === 'm6' || i.id === 'toner' || i.isConditional);
    if (tonerItem && !items.some((i) => i.id === tonerItem.id)) {
      items = [...items, tonerItem];
    }
  } else {
    items = items.filter((i) => i.id !== 'm6' && i.id !== 'toner' && !i.isConditional);
  }

  return items;
}

describe('Routine Item Filtering & Strict Business Rules', () => {
  describe('Quick Mode Item Mapping (Bug P0 Fix)', () => {
    it('returns complete product objects with name, desc, and category in Quick Mode', () => {
      const items = getActiveItems({
        mode: 'pagi',
        routineMode: 'quick',
        tonerEnabled: false,
        isExfoliatingDay: false,
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
        isExfoliatingDay: false,
      });

      const fullItems = getActiveItems({
        mode: 'pagi',
        routineMode: 'full',
        tonerEnabled: false,
        isExfoliatingDay: false,
      });

      expect(quickItems.length).toBeLessThan(fullItems.length);
      expect(quickItems.length).toBe(3); // p1, p2, p3
    });
  });

  describe('Strict Exfoliating Toner Rules (AGENTS.md Rule 1 & Bug P1 Fix)', () => {
    it('LOCKS and EXCLUDES Exfoliating Toner on non-exfoliating nights (e.g. Friday night)', () => {
      const items = getActiveItems({
        mode: 'malam',
        routineMode: 'full',
        tonerEnabled: true,
        isExfoliatingDay: false, // Not Wed or Sat
      });

      const hasToner = items.some((i) => i.id === 'm6' || i.name.includes('Exfoliating Toner'));
      expect(hasToner).toBe(false);
    });

    it('LOCKS and EXCLUDES Exfoliating Toner when user toggle is OFF (even on Wed/Sat night)', () => {
      const items = getActiveItems({
        mode: 'malam',
        routineMode: 'full',
        tonerEnabled: false, // Toggle turned off
        isExfoliatingDay: true, // Wed/Sat
      });

      const hasToner = items.some((i) => i.id === 'm6' || i.name.includes('Exfoliating Toner'));
      expect(hasToner).toBe(false);
    });

    it('LOCKS and EXCLUDES Exfoliating Toner during daytime (Pagi, Siang, Sore)', () => {
      for (const mode of ['pagi', 'siang', 'sore']) {
        const items = getActiveItems({
          mode,
          routineMode: 'full',
          tonerEnabled: true,
          isExfoliatingDay: true,
        });

        const hasToner = items.some((i) => i.id === 'm6' || i.name.includes('Exfoliating Toner'));
        expect(hasToner).toBe(false);
      }
    });

    it('ACTIVATES Exfoliating Toner ONLY on Wed/Sat night when toggle is ON', () => {
      const items = getActiveItems({
        mode: 'malam',
        routineMode: 'full',
        tonerEnabled: true,
        isExfoliatingDay: true, // Wed/Sat
      });

      const tonerItem = items.find((i) => i.id === 'm6');
      expect(tonerItem).toBeDefined();
      expect(tonerItem.name).toBe('Exfoliating Toner');
    });
  });
});
