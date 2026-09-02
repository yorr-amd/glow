import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/plugin-notification';
import { isExfoliatingDay } from './dateHelper';

/**
 * 🌸 Cece Yori Skincare Notification Service
 * Integrates Tauri 2 native Windows desktop notifications
 */

export async function initNotificationService() {
  try {
    let granted = await isPermissionGranted();
    if (!granted) {
      const permission = await requestPermission();
      granted = permission === 'granted';
    }
    return granted;
  } catch (err) {
    console.warn('Native notification not available or running outside Tauri:', err);
    return false;
  }
}

export async function notifySkincare(title, body) {
  try {
    const granted = await initNotificationService();
    if (granted) {
      sendNotification({
        title: title || 'Cece Yori ✦ Glow Tracker',
        body: body,
      });
    }
  } catch (err) {
    console.warn('Failed to send notification:', err);
  }
}

// Track last sent notifications so we don't spam
const NOTIFIED_KEY = 'ceceyori_notified_today';

export function checkAndSendRoutineReminders() {
  const now = new Date();
  const hour = now.getHours();
  const todayDate = now.toISOString().split('T')[0];

  let notified = {};
  try {
    notified = JSON.parse(localStorage.getItem(NOTIFIED_KEY) || '{}');
  } catch {}

  // If date changed, reset notification flags
  if (notified.date !== todayDate) {
    notified = { date: todayDate };
  }

  // 1. Morning Reminder (between 7:00 and 9:00)
  if (hour >= 7 && hour < 10 && !notified.morning) {
    notifySkincare(
      '☀️ Rutin Pagi Dimulai!',
      'Selamat pagi Cece! Jangan lupa cuci muka & sunscreen ☀️'
    );
    notified.morning = true;
  }

  // 2. Night Reminder (between 19:00 and 22:00)
  if (hour >= 19 && hour < 23 && !notified.night) {
    if (isExfoliatingDay()) {
      notifySkincare(
        '🧪 Jadwal Toner Merah Malam Ini!',
        'Malam ini jadwal Toner Merah! Jangan lupa eksfoliasi lipatan ya Cece ✨'
      );
    } else {
      notifySkincare(
        '🌙 Rutin Malam Tiba!',
        'Saatnya manjain kulit sebelum tidur biar besok makin cerah 💆'
      );
    }
    notified.night = true;
  }

  localStorage.setItem(NOTIFIED_KEY, JSON.stringify(notified));
}
