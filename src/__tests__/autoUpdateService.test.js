import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { isNewerVersion, formatFileSize, getAppPlatform } from '../utils/autoUpdateService';

describe('autoUpdateService', () => {
  describe('isNewerVersion', () => {
    it('returns true when remote version is higher than local version', () => {
      expect(isNewerVersion('1.2.0', '1.1.0')).toBe(true);
      expect(isNewerVersion('2.0.0', '1.9.9')).toBe(true);
      expect(isNewerVersion('1.1.1', '1.1.0')).toBe(true);
      expect(isNewerVersion('v1.2.0', '1.1.0')).toBe(true);
      expect(isNewerVersion('v1.2.0', 'v1.1.0')).toBe(true);
    });

    it('returns false when remote version is equal or lower', () => {
      expect(isNewerVersion('1.1.0', '1.1.0')).toBe(false);
      expect(isNewerVersion('1.0.9', '1.1.0')).toBe(false);
      expect(isNewerVersion('0.9.0', '1.0.0')).toBe(false);
      expect(isNewerVersion(null, '1.1.0')).toBe(false);
      expect(isNewerVersion('1.1.0', null)).toBe(false);
    });
  });

  describe('formatFileSize', () => {
    it('formats bytes into megabytes string accurately', () => {
      expect(formatFileSize(1024 * 1024 * 4.5)).toBe('4.50 MB');
      expect(formatFileSize(1024 * 1024 * 12.34)).toBe('12.34 MB');
      expect(formatFileSize(null)).toBe('4.5 MB');
    });
  });

  describe('getAppPlatform', () => {
    beforeEach(() => {
      global.window = {};
    });

    afterEach(() => {
      delete global.window;
    });

    it('identifies desktop platform when Tauri internals exist', () => {
      global.window.__TAURI__ = {};
      expect(getAppPlatform()).toBe('desktop');
    });

    it('identifies android platform when Capacitor platform is android', () => {
      global.window.Capacitor = {
        getPlatform: () => 'android',
      };
      expect(getAppPlatform()).toBe('android');
    });

    it('defaults to web when neither Tauri nor Capacitor android is detected', () => {
      expect(getAppPlatform()).toBe('web');
    });
  });
});
