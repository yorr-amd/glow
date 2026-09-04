/**
 * 🌸 Glow Auto Update Service
 * Menangani deteksi versi terbaru dari GitHub Releases dan memicu
 * pengunduhan serta pemasangan otomatis (1-Tap Auto Update) di Android APK & Web.
 */

export const APP_VERSION = '1.1.0';
export const GITHUB_REPO = 'yorr-amd/glow';

const AUTO_UPDATE_STORAGE_KEY = 'glow_auto_update_enabled';
const LAST_CHECK_STORAGE_KEY = 'glow_last_update_check';
const DISMISSED_VERSION_KEY = 'glow_dismissed_update_version';

// Interval auto-check default: 6 jam (dalam milidetik)
const AUTO_CHECK_INTERVAL_MS = 6 * 60 * 60 * 1000;

/**
 * Membandingkan dua string versi (contoh: "1.2.0" vs "1.1.0")
 * Mengembalikan true jika remote > local
 */
export function isNewerVersion(remote, local) {
  if (!remote || !local) return false;

  const cleanRemote = remote.replace(/^v/i, '').trim();
  const cleanLocal = local.replace(/^v/i, '').trim();

  const rParts = cleanRemote.split('.').map((n) => parseInt(n, 10) || 0);
  const lParts = cleanLocal.split('.').map((n) => parseInt(n, 10) || 0);

  const maxLen = Math.max(rParts.length, lParts.length);
  for (let i = 0; i < maxLen; i++) {
    const r = rParts[i] || 0;
    const l = lParts[i] || 0;
    if (r > l) return true;
    if (r < l) return false;
  }
  return false;
}

/**
 * Format ukuran file ke format terbaca (misal: 4.48 MB)
 */
export function formatFileSize(bytes) {
  if (!bytes || isNaN(bytes)) return '4.5 MB';
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(2)} MB`;
}

function getStorageItem(key) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch (e) {
    // ignore
  }
  return null;
}

function setStorageItem(key, value) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  } catch (e) {
    // ignore
  }
}

function removeStorageItem(key) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  } catch (e) {
    // ignore
  }
}

/**
 * Status toggle Auto Update di preferensi pengguna
 */
export function isAutoUpdateEnabled() {
  const saved = getStorageItem(AUTO_UPDATE_STORAGE_KEY);
  return saved === null ? true : saved === 'true';
}

export function setAutoUpdateEnabled(enabled) {
  setStorageItem(AUTO_UPDATE_STORAGE_KEY, enabled ? 'true' : 'false');
}

export function getDismissedVersion() {
  return getStorageItem(DISMISSED_VERSION_KEY) || '';
}

export function setDismissedVersion(version) {
  if (version) {
    setStorageItem(DISMISSED_VERSION_KEY, version);
  } else {
    removeStorageItem(DISMISSED_VERSION_KEY);
  }
}

/**
 * Memeriksa rilis terbaru dari GitHub API
 */
export async function checkForAppUpdates({ force = false, silent = false } = {}) {
  // Jika auto update dinonaktifkan dan bukan cek manual, lewati
  if (!force && !isAutoUpdateEnabled()) {
    return { updateAvailable: false, reason: 'disabled' };
  }

  // Jika bukan pengecekan manual, batasi interval pengecekan
  if (!force) {
    const lastCheck = parseInt(getStorageItem(LAST_CHECK_STORAGE_KEY) || '0', 10);
    const now = Date.now();
    if (now - lastCheck < AUTO_CHECK_INTERVAL_MS) {
      return { updateAvailable: false, reason: 'recently_checked' };
    }
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return { updateAvailable: false, reason: 'no_releases_found' };
      }
      throw new Error(`GitHub API HTTP ${response.status}`);
    }

    const data = await response.json();
    setStorageItem(LAST_CHECK_STORAGE_KEY, Date.now().toString());

    const remoteTag = data.tag_name || '';
    const remoteVersion = remoteTag.replace(/^v/i, '').trim();
    const hasNewVersion = isNewerVersion(remoteVersion, APP_VERSION);

    // Cari aset APK dari daftar aset rilis
    const assets = Array.isArray(data.assets) ? data.assets : [];
    const apkAsset = assets.find((a) => a.name && a.name.toLowerCase().endsWith('.apk'));
    const winAsset = assets.find(
      (a) => a.name && (a.name.toLowerCase().endsWith('-setup.exe') || a.name.toLowerCase().endsWith('.exe'))
    );

    const updateInfo = {
      updateAvailable: hasNewVersion,
      currentVersion: APP_VERSION,
      latestVersion: remoteVersion || APP_VERSION,
      tagName: remoteTag,
      title: data.name || remoteTag,
      releaseNotes: data.body || '',
      publishedAt: data.published_at,
      apkUrl: apkAsset ? apkAsset.browser_download_url : null,
      apkSize: apkAsset ? apkAsset.size : null,
      apkName: apkAsset ? apkAsset.name : `Glow-v${remoteVersion || 'latest'}.apk`,
      winUrl: winAsset ? winAsset.browser_download_url : null,
      releaseUrl: data.html_url || `https://github.com/${GITHUB_REPO}/releases`,
    };

    // Jika user sebelumnya sudah memilih "Nanti Saja" untuk versi ini (bukan pengecekan manual)
    if (hasNewVersion && !force) {
      const dismissed = getDismissedVersion();
      if (dismissed === remoteVersion) {
        return { ...updateInfo, updateAvailable: false, dismissed: true };
      }
    }

    return updateInfo;
  } catch (error) {
    if (!silent) {
      console.warn('[Glow AutoUpdate] Gagal memeriksa rilis terbaru:', error);
    }
    return {
      updateAvailable: false,
      error: error.message,
    };
  }
}

/**
 * Menjalankan proses pengunduhan dan instalasi otomatis
 */
export async function triggerAutoInstall(updateInfo) {
  const downloadUrl = updateInfo.apkUrl || updateInfo.releaseUrl;
  const fileName = updateInfo.apkName || 'Glow-update.apk';
  const version = updateInfo.latestVersion || 'latest';

  // 1. Periksa apakah berjalan di lingkungan Capacitor Native (Android)
  const isCapacitor = typeof window !== 'undefined' && window.Capacitor;
  const isAndroid = isCapacitor && window.Capacitor.getPlatform() === 'android';

  if (isAndroid && window.Capacitor.Plugins?.AutoUpdate) {
    try {
      const res = await window.Capacitor.Plugins.AutoUpdate.downloadAndInstall({
        url: downloadUrl,
        version: version,
        fileName: fileName,
      });
      return {
        success: true,
        mode: 'native_installer',
        message: res.message || 'Mulai mengunduh di latar belakang',
      };
    } catch (nativeErr) {
      console.warn('[Glow AutoUpdate] Native plugin gagal, fallback ke browser:', nativeErr);
    }
  }

  // 2. Fallback: Buka download langsung via browser / sistem
  if (typeof window !== 'undefined') {
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = fileName;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return {
      success: true,
      mode: 'browser_download',
      message: 'Mengunduh file pembaruan melalui browser',
    };
  }

  return { success: false, message: 'Tidak dapat memulai unduhan' };
}
