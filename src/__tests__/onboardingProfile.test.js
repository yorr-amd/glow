import { describe, it, expect, beforeEach } from 'vitest';

// Setup mock localStorage and window for node test environment
const createLocalStorageMock = () => {
  let store = {};
  return {
    getItem: (key) => store[key] ?? null,
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
    get length() { return Object.keys(store).length; },
    key: (i) => Object.keys(store)[i] || null,
  };
};

const mockLocalStorage = createLocalStorageMock();
global.localStorage = mockLocalStorage;
global.window = {
  localStorage: mockLocalStorage,
};

import {
  createAccount,
  getActiveAccountId,
  setActiveAccountId,
  getUserData,
} from '../services/db';
import {
  getCustomProducts,
  saveCustomProducts,
} from '../data/skincareData';
import { generateStarterProducts } from '../components/OnboardingWizard';

describe('Onboarding Profile & Starter Kit System', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  it('generates appropriate curated starter products for Acne-Prone skin', () => {
    const products = generateStarterProducts('Acne-Prone');

    expect(products.pagi).toBeDefined();
    expect(products.malam).toBeDefined();

    // Check acne-specific cleanser
    const pagiCleanser = products.pagi.find((p) => p.name.includes('Salicylic Acid'));
    expect(pagiCleanser).toBeDefined();
    expect(pagiCleanser.isEssential).toBe(true);

    // Check exfoliating toner safety lock schedule (Rabu & Sabtu malam: [3, 6])
    const toner = products.malam.find((p) => p.name.includes('Exfoliating'));
    expect(toner).toBeDefined();
    expect(toner.scheduledDays).toEqual([3, 6]);
    expect(toner.scheduleType).toBe('custom_days');
  });

  it('generates rich moisturizing products for Dry skin', () => {
    const products = generateStarterProducts('Kering (Dry)');

    const dryCleanser = products.pagi.find((p) => p.name.includes('Hydrating Milk'));
    expect(dryCleanser).toBeDefined();

    const dryNightCream = products.malam.find((p) => p.name.includes('Ceramide'));
    expect(dryNightCream).toBeDefined();
  });

  it('generates lightweight oil-free products for Oily skin', () => {
    const products = generateStarterProducts('Berminyak (Oily)');

    const oilyMoisturizer = products.pagi.find((p) => p.name.includes('Oil-Free Gel'));
    expect(oilyMoisturizer).toBeDefined();
  });

  it('persists onboarded user profile and isolated starter shelf in DB', async () => {
    const newProfile = {
      name: 'Cece Yori',
      avatar: '🌸',
      skinType: 'Normal',
      tagline: 'Glow journey & radiant skin ✨',
      skinGoals: ['Cerah Alami & Glowing', 'Skin Barrier Kuat'],
      memberSince: 'September 2026',
    };

    const saved = await createAccount(newProfile);
    expect(saved.id).toBeDefined();
    expect(saved.name).toBe('Cece Yori');
    expect(saved.isRegistered).toBe(true);
    expect(getActiveAccountId()).toBe(saved.id);

    // Save starter kit for this user
    const starterKit = generateStarterProducts(saved.skinType);
    saveCustomProducts(starterKit, saved.id);

    // Verify isolation
    const userShelf = getCustomProducts(saved.id);
    expect(userShelf.pagi).toHaveLength(3);
    expect(userShelf.malam).toHaveLength(3);

    // Verify user isolated stores exist
    expect(getUserData(saved.id, 'streak_history')).toEqual([]);
    expect(getUserData(saved.id, 'checked_items')).toEqual({});
  });

  it('isolates onboarding products between two different users', async () => {
    // User 1 onboards with Dry skin
    const user1 = await createAccount({ name: 'Dry Skin Queen', skinType: 'Kering (Dry)' });
    const user1Kit = generateStarterProducts(user1.skinType);
    saveCustomProducts(user1Kit, user1.id);

    // User 2 onboards with Acne-Prone skin
    const user2 = await createAccount({ name: 'Acne Warrior', skinType: 'Acne-Prone' });
    const user2Kit = generateStarterProducts(user2.skinType);
    saveCustomProducts(user2Kit, user2.id);

    // Verify each user has their specific products
    const shelf1 = getCustomProducts(user1.id);
    const shelf2 = getCustomProducts(user2.id);

    expect(shelf1.pagi[0].name).toContain('Hydrating Milk');
    expect(shelf2.pagi[0].name).toContain('Salicylic Acid');
  });
});
