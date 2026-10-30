// ============================================================================
// BOTANICA - PWA Installation, Native OS Notifications & OTA Auto-Update Engine
// ============================================================================

export const APP_VERSION = '2.5.0';
export const SCHEMA_VERSION = 2;

// رابط استاندارد رویداد نصب PWA در مرورگرهای دسکتاپ و موبایل
export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export interface VersionManifest {
  version: string;
  schemaVersion: number;
  releaseDate: string;
  changelog: string[];
  forceReload?: boolean;
}

let deferredInstallPrompt: BeforeInstallPromptEvent | null = null;
const installListeners = new Set<(canInstall: boolean) => void>();

// ثبت شنونده رویداد نصب PWA روی موبایل (اندروید/iOS) و دسکتاپ (ویندوز/مک)
export function initPwaInstallListener(): void {
  if (typeof window === 'undefined') return;

  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    deferredInstallPrompt = e as BeforeInstallPromptEvent;
    installListeners.forEach((cb) => cb(true));
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    installListeners.forEach((cb) => cb(false));
  });
}

export function subscribeToInstallAvailability(
  callback: (canInstall: boolean) => void
): () => void {
  installListeners.add(callback);
  callback(deferredInstallPrompt !== null);
  return () => {
    installListeners.delete(callback);
  };
}

export async function triggerPwaInstall(): Promise<'accepted' | 'dismissed' | 'unavailable'> {
  if (!deferredInstallPrompt) {
    return 'unavailable';
  }
  await deferredInstallPrompt.prompt();
  const choice = await deferredInstallPrompt.userChoice;
  if (choice.outcome === 'accepted') {
    deferredInstallPrompt = null;
    installListeners.forEach((cb) => cb(false));
  }
  return choice.outcome;
}

export function isRunningStandalonePwa(): boolean {
  if (typeof window === 'undefined') return false;
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isIosStandalone = (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
  return isStandalone || isIosStandalone;
}

// ============================================================================
// مدیریت نوتیفیکیشن‌های بومی سیستم‌عامل (موبایل و لپ‌تاپ)
// ============================================================================

export function getNotificationPermissionStatus(): NotificationPermission | 'unsupported' {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

export async function requestNativeNotificationPermission(): Promise<
  NotificationPermission | 'unsupported'
> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  const permission = await Notification.requestPermission();
  return permission;
}

export async function sendNativeNotification(params: {
  title: string;
  body: string;
  tag?: string;
}): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }
  if (Notification.permission !== 'granted') {
    return false;
  }

  try {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.showNotification(params.title, {
          body: params.body,
          tag: params.tag || 'botanica-care-alert',
          dir: 'rtl',
          lang: 'fa-IR',
          icon: '/botanica-icon.svg',
          badge: '/botanica-icon.svg'
        });
        return true;
      }
    }

    new Notification(params.title, {
      body: params.body,
      tag: params.tag || 'botanica-care-alert',
      dir: 'rtl',
      lang: 'fa-IR'
    });
    return true;
  } catch (err) {
    console.error('Native notification dispatch error:', err);
    return false;
  }
}

// ============================================================================
// سیستم بررسی آپدیت خودکار (OTA Update) پس از انتشار برنامه
// ============================================================================

export async function checkForRemoteAppUpdate(): Promise<VersionManifest | null> {
  try {
    const res = await fetch(`/version.json?t=${Date.now()}`, {
      cache: 'no-store'
    });
    if (!res.ok) return null;
    const manifest = (await res.json()) as VersionManifest;
    if (manifest.version && manifest.version !== APP_VERSION) {
      return manifest;
    }
    return null;
  } catch {
    return null;
  }
}

export async function applyAppUpdateAndReload(): Promise<void> {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const reg of registrations) {
      await reg.update();
      if (reg.waiting) {
        reg.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
    }
  }
  if ('caches' in window) {
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => caches.delete(key)));
  }
  window.location.reload();
}