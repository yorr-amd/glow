import { describe, it, expect, beforeEach, afterEach } from 'vitest';

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
  setUserData,
  getUserTodayCompleted,
  setUserTodayCompleted,
  cleanLegacyData,
} from '../services/db';
import {
  getCustomProducts,
  saveCustomProducts,
  getMergedSkincareData,
} from '../data/skincareData';
import { calculateStreak } from '../components/StreakCounter';

describe('Multi-Account Data Isolation (Bug P0 & Clean Slate)', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  it('isolates custom products completely between User A and User B', async () => {
    const userA = await createAccount({ name: 'User A', id: 'user_a' });
    const userB = await createAccount({ name: 'User B', id: 'user_b' });

    // Switch to User A and add product
    setActiveAccountId(userA.id);
    expect(getCustomProducts(userA.id)).toEqual({});

    const userAProducts = {
      pagi: [{ id: 'custom_p1', name: 'User A Vitamin C', isEssential: true }],
    };
    saveCustomProducts(userAProducts, userA.id);
    expect(getCustomProducts(userA.id).pagi).toHaveLength(1);
    expect(getCustomProducts(userA.id).pagi[0].name).toBe('User A Vitamin C');

    // Switch to User B - must start completely clean (0 custom products)
    setActiveAccountId(userB.id);
    const userBProducts = getCustomProducts(userB.id);
    expect(userBProducts).toEqual({});
    expect(userBProducts.pagi).toBeUndefined();

    // Verify merged data for User B has NO products from User A
    const mergedB = getMergedSkincareData(userB.id);
    expect(mergedB.pagi.full).toHaveLength(0);

    // Verify User A still has their product
    const mergedA = getMergedSkincareData(userA.id);
    expect(mergedA.pagi.full).toHaveLength(1);
    expect(mergedA.pagi.full[0].name).toBe('User A Vitamin C');
  });

  it('isolates todayCompleted status between accounts so streak does not bleed', async () => {
    const userA = await createAccount({ name: 'User A', id: 'user_a' });
    const userB = await createAccount({ name: 'User B', id: 'user_b' });

    // User A completes today
    setUserTodayCompleted(userA.id, true);
    expect(getUserTodayCompleted(userA.id)).toBe(true);

    // User B must NOT be completed
    expect(getUserTodayCompleted(userB.id)).toBe(false);

    // User A records streak
    const today = new Date().toISOString().split('T')[0];
    setUserData(userA.id, 'streak_history', [today]);
    expect(calculateStreak(getUserData(userA.id, 'streak_history', []))).toBe(1);

    // User B streak must be 0
    expect(calculateStreak(getUserData(userB.id, 'streak_history', []))).toBe(0);
  });

  it('isolates checked items and daily history between accounts', async () => {
    const userA = await createAccount({ name: 'User A', id: 'user_a' });
    const userB = await createAccount({ name: 'User B', id: 'user_b' });

    // User A checks items
    setUserData(userA.id, 'checked_items', { pagi: ['item1', 'item2'] });
    setUserData(userB.id, 'checked_items', {});

    expect(getUserData(userA.id, 'checked_items', {}).pagi).toEqual(['item1', 'item2']);
    expect(getUserData(userB.id, 'checked_items', {}).pagi).toBeUndefined();
  });

  it('cleanLegacyData successfully purges all legacy ceceyori keys from localStorage', () => {
    mockLocalStorage.setItem('ceceyori_user_profile', JSON.stringify({ name: 'Old User' }));
    mockLocalStorage.setItem('ceceyori_streak_history', JSON.stringify(['2026-09-01']));
    mockLocalStorage.setItem('ceceyori_custom_products', JSON.stringify({ pagi: [] }));
    mockLocalStorage.setItem('ceceyori_glow_vibes_count', '45');

    cleanLegacyData();

    expect(mockLocalStorage.getItem('ceceyori_user_profile')).toBeNull();
    expect(mockLocalStorage.getItem('ceceyori_streak_history')).toBeNull();
    expect(mockLocalStorage.getItem('ceceyori_custom_products')).toBeNull();
    expect(mockLocalStorage.getItem('ceceyori_glow_vibes_count')).toBeNull();
  });
});
