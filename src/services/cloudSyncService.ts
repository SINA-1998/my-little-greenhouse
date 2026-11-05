import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import {
  type PlantEntity,
  type GardenEntity,
  type SpaceEntity,
  type MemberEntity,
  formatPersianDate
} from '../data/initialPlants';
import { CareCalculator } from '../engine/careCalculator';

export type CareActionType =
  | 'water'
  | 'mist'
  | 'snooze'
  | 'rotate'
  | 'prune'
  | 'repot'
  | 'clean_leaves';

export interface CloudConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  telegramBotToken: string;
  telegramChatId: string;
  telegramBotUsername?: string;
  browserPushEnabled: boolean;
}

export interface TelegramBotSubscriber {
  chatId: string;
  firstName: string;
  username?: string;
  lastText?: string;
  invitedMemberId?: string;
}

export interface TelegramInlineButton {
  text: string;
  callback_data?: string;
  url?: string;
}

export interface GreenhouseCloudPayload {
  spaces?: SpaceEntity[];
  plants: PlantEntity[];
  gardens: GardenEntity[];
  members?: MemberEntity[];
}

export interface TelegramSendResult {
  ok: boolean;
  sentCount: number;
  errorMsg?: string;
}

const CONFIG_STORAGE_KEY = 'sina_greenhouse_cloud_config_v1';
const LAST_UPDATE_ID_KEY = 'sina_greenhouse_tg_offset_v4';
const KB_CLEARED_PREFIX = 'sina_tg_kb_cleared_v9_';
const ROOM_ID = 'sina_office_greenhouse';

const pickStr = (...values: Array<string | undefined | null>): string => {
  for (const val of values) {
    if (typeof val === 'string' && val.trim().length > 0) {
      return val.trim();
    }
  }
  return '';
};

const toPersianNum = (num: number | string): string =>
  String(num).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

// حذف کامل کیبورد ۴ ردیفه قدیمی برای آزادسازی فضای صفحه موبایل
export const TELEGRAM_MAIN_REPLY_KEYBOARD = {
  remove_keyboard: true
};

export const copyTextSafe = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // ادامه به روش جایگزین
  }

  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const copied = document.execCommand('copy');
    document.body.removeChild(textArea);
    return copied;
  } catch {
    return false;
  }
};

export const getCloudConfig = (): CloudConfig => {
  const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
  const envSupabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const envSupabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  const envBotToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN as string | undefined;
  const envChatId = import.meta.env.VITE_TELEGRAM_CHAT_ID as string | undefined;
  const envBotUsername = import.meta.env.VITE_TELEGRAM_BOT_USERNAME as string | undefined;

  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        supabaseUrl: pickStr(parsed.supabaseUrl, envSupabaseUrl),
        supabaseAnonKey: pickStr(parsed.supabaseAnonKey, envSupabaseKey),
        telegramBotToken: pickStr(parsed.telegramBotToken, envBotToken),
        telegramChatId: pickStr(parsed.telegramChatId, envChatId),
        telegramBotUsername: pickStr(parsed.telegramBotUsername, envBotUsername),
        browserPushEnabled: Boolean(parsed.browserPushEnabled)
      };
    } catch {
      // بازگشت به مقادیر پیش‌فرض
    }
  }

  return {
    supabaseUrl: pickStr(envSupabaseUrl),
    supabaseAnonKey: pickStr(envSupabaseKey),
    telegramBotToken: pickStr(envBotToken),
    telegramChatId: pickStr(envChatId),
    telegramBotUsername: pickStr(envBotUsername),
    browserPushEnabled: false
  };
};

export const saveCloudConfig = (config: CloudConfig): void => {
  localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
};

let supabaseInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  const cfg = getCloudConfig();
  if (!cfg.supabaseUrl || !cfg.supabaseAnonKey) return null;
  if (!supabaseInstance) {
    supabaseInstance = createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
  }
  return supabaseInstance;
};

export const fetchGreenhouseFromCloud = async (): Promise<GreenhouseCloudPayload | null> => {
  const client = getSupabaseClient();
  if (!client) return null;

  const { data, error } = await client
    .from('greenhouse_state')
    .select('payload')
    .eq('room_id', ROOM_ID)
    .single();

  if (error || !data?.payload) return null;

  if (data.payload.botSettings) {
    const currentCfg = getCloudConfig();
    const remoteBot = data.payload.botSettings;
    saveCloudConfig({
      ...currentCfg,
      telegramBotToken: pickStr(currentCfg.telegramBotToken, remoteBot.telegramBotToken),
      telegramChatId: pickStr(currentCfg.telegramChatId, remoteBot.telegramChatId),
      telegramBotUsername: pickStr(currentCfg.telegramBotUsername, remoteBot.telegramBotUsername)
    });
  }

  return data.payload as GreenhouseCloudPayload;
};

export const pushGreenhouseToCloud = async (payload: {
  spaces: SpaceEntity[];
  plants: PlantEntity[];
  gardens: GardenEntity[];
  members: MemberEntity[];
}): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client) return false;

  const cfg = getCloudConfig();
  const fullPayload = {
    ...payload,
    botSettings: {
      telegramBotToken: cfg.telegramBotToken,
      telegramChatId: cfg.telegramChatId,
      telegramBotUsername: cfg.telegramBotUsername
    }
  };

  const { error } = await client.from('greenhouse_state').upsert(
    {
      room_id: ROOM_ID,
      payload: fullPayload,
      updated_at: new Date().toISOString()
    },
    { onConflict: 'room_id' }
  );

  return !error;
};

export const fetchTelegramBotUsername = async (
  customToken?: string
): Promise<string | null> => {
  const cfg = getCloudConfig();
  const fallbackUsername = pickStr(cfg.telegramBotUsername);
  const token = pickStr(customToken, cfg.telegramBotToken);
  if (!token) return fallbackUsername || null;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500);

  try {
    const res = await fetch(
      `https://greenhouse-bot.sinafallah-ai.workers.dev/bot${token}/getMe`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);
    if (!res.ok) return fallbackUsername || null;
    const data = await res.json();
    const username: string = pickStr(data?.result?.username);
    if (username) {
      saveCloudConfig({ ...cfg, telegramBotUsername: username });
      return username;
    }
    return fallbackUsername || null;
  } catch {
    clearTimeout(timeoutId);
    return fallbackUsername || null;
  }
};

// ثبت خودکار منوی دستورات بومی تلگرام (دکمه Menu کنار باکس تایپ که هیچ فضایی از صفحه نمی‌گیرد)
export const setupTelegramBotCommands = async (customToken?: string): Promise<boolean> => {
  const cfg = getCloudConfig();
  const token = pickStr(customToken, cfg.telegramBotToken);
  if (!token) return false;

  try {
    const commands = [
      { command: 'status', description: '🌿 داشبورد زنده وضعیت گلخانه' },
      { command: 'plants', description: '🪴 فهرست و شناسنامه گیاهان' },
      { command: 'thirsty', description: '💧 گلدان‌های نیازمند آبیاری' },
      { command: 'mist', description: '💨 نوبت غبارپاشی برگ‌ها' },
      { command: 'rotate', description: '🔄 نوبت چرخش ۹۰ درجه' },
      { command: 'history', description: '🕒 گزارش آخرین فعالیت‌ها' },
      { command: 'radiator', description: '🔥 وضعیت گرمایش شوفاژ' }
    ];

    const res = await fetch(
      `https://greenhouse-bot.sinafallah-ai.workers.dev/bot${token}/setMyCommands`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commands })
      }
    );

    // تنظیم دکمه Menu کنار کادر پیام روی حالت Commands
    await fetch(
      `https://greenhouse-bot.sinafallah-ai.workers.dev/bot${token}/setChatMenuButton`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menu_button: { type: 'commands' } })
      }
    ).catch(() => {});

    return res.ok;
  } catch {
    return false;
  }
};

// پاکسازی خودکار کیبورد بزرگ ۴ ردیفه قدیمی از پایین صفحه موبایل کاربر (فقط ۱ بار به ازای هر چت)
const ensureLegacyReplyKeyboardCleared = async (
  token: string,
  chatId: string,
  forceClear: boolean = false
): Promise<void> => {
  const flagKey = `${KB_CLEARED_PREFIX}${chatId}`;
  if (!forceClear && localStorage.getItem(flagKey) === 'done') return;

  try {
    const res = await fetch(
      `https://greenhouse-bot.sinafallah-ai.workers.dev/bot${token}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: '🌿 <b>محیط ربات به نسخه مینیمال ارتقا یافت</b>\nکیبورد بزرگ پایین صفحه جمع شد؛ از دکمه <b>Menu</b> کنار کادر پیام یا دکمه‌های زیر هر کارت استفاده کنید.',
          parse_mode: 'HTML',
          reply_markup: { remove_keyboard: true }
        })
      }
    );
    if (res.ok) {
      localStorage.setItem(flagKey, 'done');
    }
  } catch {
    // نادیده گرفتن خطای شبکه
  }
};

// ویرایش درجای کارت پیام در تلگرام (جلوگیری از ارسال پیام‌های تکراری و شلوغ شدن صفحه چت)
const editTelegramMessageInPlace = async (params: {
  token: string;
  chatId: string;
  messageId: number;
  title: string;
  bodyHtml: string;
  inlineKeyboard?: TelegramInlineButton[][];
}): Promise<boolean> => {
  const { token, chatId, messageId, title, bodyHtml, inlineKeyboard } = params;
  const htmlMessage = title ? `<b>${title}</b>\n\n${bodyHtml}` : bodyHtml;

  try {
    const payload: Record<string, unknown> = {
      chat_id: chatId,
      message_id: messageId,
      text: htmlMessage,
      parse_mode: 'HTML',
      disable_web_page_preview: true
    };
    if (inlineKeyboard && inlineKeyboard.length > 0) {
      payload.reply_markup = { inline_keyboard: inlineKeyboard };
    }

    const res = await fetch(
      `https://greenhouse-bot.sinafallah-ai.workers.dev/bot${token}/editMessageText`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
    );
    return res.ok;
  } catch {
    return false;
  }
};

const cachedSubscribersMap = new Map<string, TelegramBotSubscriber>();

export const fetchRecentBotSubscribers = async (
  customToken?: string
): Promise<TelegramBotSubscriber[]> => {
  const cfg = getCloudConfig();
  const token = pickStr(customToken, cfg.telegramBotToken);
  if (!token) return Array.from(cachedSubscribersMap.values());

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const res = await fetch(
      `https://greenhouse-bot.sinafallah-ai.workers.dev/bot${token}/getUpdates?limit=30`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);
    if (!res.ok) return Array.from(cachedSubscribersMap.values());
    const data = await res.json();
    if (data?.ok && Array.isArray(data.result)) {
      for (const item of data.result) {
        const msg = item.message || item.edited_message || item.my_chat_member;
        const chat = msg?.chat;
        const text: string = pickStr(msg?.text);
        if (chat && chat.id) {
          const cid = String(chat.id);
          let invitedMemberId: string | undefined = undefined;
          if (text.startsWith('/start join_')) {
            invitedMemberId = text.replace('/start join_', '').trim();
          }
          const prev = cachedSubscribersMap.get(cid);
          const fullName = [chat.first_name, chat.last_name].filter(Boolean).join(' ');
          const finalName = pickStr(fullName, chat.title, 'کاربر تلگرام');
          const finalInvite = invitedMemberId || prev?.invitedMemberId;

          cachedSubscribersMap.set(cid, {
            chatId: cid,
            firstName: finalName,
            username: chat.username,
            lastText: pickStr(text, '/start'),
            invitedMemberId: finalInvite
          });
        }
      }
    }
    return Array.from(cachedSubscribersMap.values());
  } catch {
    clearTimeout(timeoutId);
    return Array.from(cachedSubscribersMap.values());
  }
};

const resolveTargetChatIds = (
  spaceId: string,
  members: MemberEntity[],
  mode: 'alerts' | 'actions'
): string[] => {
  const cfg = getCloudConfig();
  const targets = new Set<string>();

  members.forEach((m) => {
    if (!m.active) return;
    const chatId = pickStr(m.telegramChatId);
    if (!chatId) return;

    const isSuper = m.role === 'super_admin';
    const isAssigned = m.assignedSpaces.includes(spaceId);
    if (!isSuper && !isAssigned) return;

    if (mode === 'alerts' && m.notifyAlerts) targets.add(chatId);
    if (mode === 'actions' && m.notifyActions) targets.add(chatId);
  });

  const fallbackChatId = pickStr(cfg.telegramChatId);
  if (targets.size === 0 && fallbackChatId) {
    targets.add(fallbackChatId);
  }

  return Array.from(targets);
};

// ارسال پیام کارت مینیمال به تلگرام (همراه با جمع کردن خودکار کیبورد بزرگ قدیمی)
export const sendTelegramToTargets = async (
  title: string,
  bodyHtml: string,
  targetChatIds?: string[],
  inlineKeyboard?: TelegramInlineButton[][],
  clearReplyKeyboard: boolean = false
): Promise<TelegramSendResult> => {
  const cfg = getCloudConfig();

  if (
    cfg.browserPushEnabled &&
    'Notification' in window &&
    Notification.permission === 'granted'
  ) {
    const plainBody = bodyHtml.replace(/<[^>]+>/g, '');
    new Notification(title, { body: plainBody });
  }

  const token = pickStr(cfg.telegramBotToken);
  if (!token) {
    return { ok: false, sentCount: 0, errorMsg: 'توکن ربات تلگرام وارد نشده است.' };
  }

  const fallbackChatId = pickStr(cfg.telegramChatId);
  const chatIds =
    targetChatIds && targetChatIds.length > 0
      ? targetChatIds
      : fallbackChatId
      ? [fallbackChatId]
      : [];

  if (chatIds.length === 0) {
    return {
      ok: false,
      sentCount: 0,
      errorMsg: 'هیچ گیرنده فعالی (Chat ID) برای این گلخانه تنظیم نشده است.'
    };
  }

  const htmlMessage = title ? `<b>${title}</b>\n\n${bodyHtml}` : bodyHtml;

  let sentCount = 0;
  for (const chatId of chatIds) {
    try {
      // اطمینان از جمع شدن کیبورد ۴ ردیفه قدیمی در اولین ارتباط
      await ensureLegacyReplyKeyboardCleared(token, chatId, clearReplyKeyboard);

      const payload: Record<string, unknown> = {
        chat_id: chatId,
        text: htmlMessage,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      };

      if (inlineKeyboard && inlineKeyboard.length > 0) {
        payload.reply_markup = { inline_keyboard: inlineKeyboard };
      } else if (clearReplyKeyboard) {
        payload.reply_markup = { remove_keyboard: true };
      }

      const res = await fetch(
        `https://greenhouse-bot.sinafallah-ai.workers.dev/bot${token}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      );
      if (res.ok) sentCount++;
    } catch {
      // ادامه به گیرنده بعدی
    }
  }

  return {
    ok: sentCount > 0,
    sentCount,
    errorMsg: sentCount === 0 ? 'ارسال به تلگرام ناموفق بود.' : undefined
  };
};

export const sendInstantNotification = async (
  title: string,
  body: string
): Promise<boolean> => {
  const res = await sendTelegramToTargets(title, body);
  return res.ok;
};

// ============================================================================
// ۱. گزارش مینیمال و متقارن ثبت عملیات مراقبتی (با واحد میلی‌لیتر)
// ============================================================================
export const sendCareActionTelegramReport = async (params: {
  space: SpaceEntity;
  plant: PlantEntity;
  gardenName: string;
  actionType: CareActionType;
  actor: string;
  note?: string;
  members: MemberEntity[];
  sourceLabel?: string;
}): Promise<TelegramSendResult> => {
  const { space, plant, gardenName, actionType, actor, note, members, sourceLabel } = params;
  const metrics = CareCalculator.evaluatePlant(plant, space.radiatorOn);
  const nowTime = new Date().toLocaleTimeString('fa-IR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  let badge = '💧 ثبت آبیاری';
  let detailLine = '';
  let scheduleLine = '';

  if (actionType === 'water') {
    badge = plant.fertDue ? '💧 ثبت آبیاری و کوددهی' : '💧 ثبت آبیاری گلدان';
    detailLine = `پیمانه: <b>${toPersianNum(plant.doseMl)} میلی‌لیتر</b> (${plant.doseCup})`;
    scheduleLine = `موعد بعدی: ${toPersianNum(metrics.effectiveCycleDays)} روز دیگر`;
  } else if (actionType === 'mist') {
    badge = '💨 ثبت غبارپاشی برگ';
    detailLine = 'رطوبت‌رسانی برگ‌ها انجام شد';
    scheduleLine = `آبیاری خاک: ${metrics.nextWateringText}`;
  } else if (actionType === 'rotate') {
    badge = '🔄 ثبت چرخش ۹۰ درجه';
    detailLine = 'تقارن نوری تاج و ساقه تنظیم شد';
    scheduleLine = 'چرخش بعدی: ۲ نوبت آبیاری دیگر';
  } else if (actionType === 'prune') {
    badge = '✂️ ثبت هرس و فرم‌دهی';
    detailLine = 'برگ‌چینی و سرزنی تخصصی انجام شد';
    scheduleLine = `رطوبت فعلی بستر: ${toPersianNum(metrics.moisturePercent)}٪`;
  } else if (actionType === 'repot') {
    badge = '🪴 ثبت تعویض بستر خاک';
    detailLine = `حجم بستر: ${toPersianNum(plant.potVolumeLiters || 2)} لیتر`;
    scheduleLine = `تعویض بعدی: ${toPersianNum(plant.repotCycleMonths || 18)} ماه دیگر`;
  } else {
    badge = '🛡️ تعویق آبیاری (خاک مرطوب)';
    detailLine = 'بستر هنوز مرطوب است و نیاز به آب ندارد';
    scheduleLine = 'بررسی مجدد: ۲ روز دیگر';
  }

  const actorTag = sourceLabel ? `${actor} (${sourceLabel})` : actor;

  const bodyLines: string[] = [
    `🪴 <b>${plant.name}</b> • پلاک <code>${plant.code}</code>`,
    `📍 ${space.icon} ${space.name} (${gardenName})`,
    `<blockquote>• ${detailLine}\n• ${scheduleLine}${
      note ? `\n• یادداشت: ${note}` : ''
    }</blockquote>`,
    `👤 ثبت‌کننده: <b>${actorTag}</b> • ساعت ${toPersianNum(nowTime)}`
  ];

  // ۲ دکمه متقارن و کوتاه در پایین کارت گزارش
  const inlineButtons: TelegramInlineButton[][] = [
    [
      {
        text: `📖 شناسنامه ${plant.code}`,
        callback_data: `info:${plant.id}`
      },
      {
        text: `📊 داشبورد گلخانه`,
        callback_data: `status:${space.id}`
      }
    ]
  ];

  const targetChatIds = resolveTargetChatIds(space.id, members, 'actions');
  return await sendTelegramToTargets(
    badge,
    bodyLines.join('\n'),
    targetChatIds,
    inlineButtons
  );
};

// ============================================================================
// ۲. سازنده داشبورد وضعیت گلخانه (با بلوک تاشوی expandable و دکمه‌های ۲ ستونه متقارن)
// ============================================================================
const buildSpaceStatusCardContent = (params: {
  space: SpaceEntity;
  plants: PlantEntity[];
  gardens: GardenEntity[];
  level: 'morning' | 'noon_escalation';
}): {
  title: string;
  bodyHtml: string;
  inlineKeyboard: TelegramInlineButton[][];
  hasDueItems: boolean;
} => {
  const { space, plants, gardens, level } = params;
  const spacePlants = plants.filter(
    (p) => !p.archived && pickStr(p.spaceId, 'office') === space.id
  );
  const persianToday = formatPersianDate(0);

  const thirstyLines: string[] = [];
  const mistLines: string[] = [];
  const rotateLines: string[] = [];
  const healthyLines: string[] = [];
  const inlineKeyboard: TelegramInlineButton[][] = [];

  spacePlants.forEach((p) => {
    const gObj = gardens.find((g) => g.id === p.garden);
    const m = CareCalculator.evaluatePlant(p, space.radiatorOn, new Date(), gObj);

    if (m.needsWateringNow) {
      thirstyLines.push(
        `• <b>${p.name}</b> (<code>${p.code}</code>) ← <b>${toPersianNum(p.doseMl)} میلی‌لیتر</b>`
      );
      if (inlineKeyboard.length < 6) {
        // چیدمان متقارن ۲ ستونه با برچسب‌های کوتاه و بدون برش
        inlineKeyboard.push([
          {
            text: `💧 آبیاری ${p.code} (${toPersianNum(p.doseMl)}ml)`,
            callback_data: `act:w:${p.id}`
          },
          {
            text: `🛡️ خاک مرطوب ${p.code}`,
            callback_data: `act:s:${p.id}`
          }
        ]);
      }
    } else {
      healthyLines.push(
        `• ${p.name} (${p.code}): ${toPersianNum(m.moisturePercent)}٪ رطوبت (${toPersianNum(
          m.daysRemaining
        )} روز مانده)`
      );
    }

    if (m.needsMistingNow) {
      mistLines.push(`• <b>${p.name}</b> (<code>${p.code}</code>)`);
      if (inlineKeyboard.length < 6 && !m.needsWateringNow) {
        inlineKeyboard.push([
          {
            text: `💨 غبارپاشی ${p.code}`,
            callback_data: `act:m:${p.id}`
          },
          {
            text: `📖 شناسنامه ${p.code}`,
            callback_data: `info:${p.id}`
          }
        ]);
      }
    }

    if (m.needsQuarterTurn) {
      rotateLines.push(`• <b>${p.name}</b> (<code>${p.code}</code>)`);
      if (inlineKeyboard.length < 6 && !m.needsWateringNow && !m.needsMistingNow) {
        inlineKeyboard.push([
          {
            text: `🔄 چرخش ۹۰° ${p.code}`,
            callback_data: `act:r:${p.id}`
          },
          {
            text: `📖 شناسنامه ${p.code}`,
            callback_data: `info:${p.id}`
          }
        ]);
      }
    }
  });

  // نوار کنترل ۲ ستونه متقارن در پایین داشبورد
  inlineKeyboard.push([
    {
      text: `🪴 فهرست گلدان‌ها (${toPersianNum(spacePlants.length)})`,
      callback_data: `list:${space.id}`
    },
    {
      text: space.radiatorOn ? '🔥 شوفاژ: روشن' : '🍃 شوفاژ: خاموش',
      callback_data: `rad:${space.id}`
    }
  ]);

  const hasDueItems =
    thirstyLines.length > 0 || mistLines.length > 0 || rotateLines.length > 0;

  const title =
    level === 'noon_escalation'
      ? `🔔 یادآور نوبت رسیدگی • ${space.name}`
      : `${space.icon} داشبورد زنده • ${space.name}`;

  if (!hasDueItems) {
    const cleanBody: string[] = [
      `📅 ${persianToday} • گرمایش شوفاژ: <b>${space.radiatorOn ? 'روشن 🔥' : 'خاموش 🍃'}</b>`,
      '',
      `✨ تمام <b>${toPersianNum(spacePlants.length)} گلدان</b> این گلخانه سیراب و متقارن هستند و امروز نیازی به آبیاری ندارند.`
    ];

    if (healthyLines.length > 0) {
      cleanBody.push(
        '',
        `<blockquote expandable>🌿 <b>وضعیت رطوبت گلدان‌های سیراب (${toPersianNum(
          healthyLines.length
        )} گلدان):</b>\n${healthyLines.join('\n')}</blockquote>`
      );
    }

    return {
      title,
      bodyHtml: cleanBody.join('\n'),
      inlineKeyboard,
      hasDueItems: false
    };
  }

  const sections: string[] = [
    `📅 ${persianToday} • شوفاژ: <b>${space.radiatorOn ? 'روشن 🔥' : 'خاموش 🍃'}</b>`,
    ''
  ];

  if (thirstyLines.length > 0) {
    sections.push(`💧 <b>نوبت آبیاری امروز (${toPersianNum(thirstyLines.length)} گلدان):</b>`);
    sections.push(...thirstyLines);
    sections.push('');
  }

  if (mistLines.length > 0) {
    sections.push(`💨 <b>نوبت غبارپاشی برگ (${toPersianNum(mistLines.length)} گلدان):</b>`);
    sections.push(...mistLines);
    sections.push('');
  }

  if (rotateLines.length > 0) {
    sections.push(`🔄 <b>نوبت چرخش ۹۰ درجه (${toPersianNum(rotateLines.length)} گلدان):</b>`);
    sections.push(...rotateLines);
  }

  if (healthyLines.length > 0) {
    sections.push(
      '',
      `<blockquote expandable>✅ <b>سایر گلدان‌های سیراب (${toPersianNum(
        healthyLines.length
      )} مورد):</b>\n${healthyLines.join('\n')}</blockquote>`
    );
  }

  return {
    title,
    bodyHtml: sections.join('\n').trim(),
    inlineKeyboard,
    hasDueItems: true
  };
};

export const sendScheduledEscalationReport = async (params: {
  space: SpaceEntity;
  plants: PlantEntity[];
  gardens: GardenEntity[];
  members: MemberEntity[];
  level: 'morning' | 'noon_escalation';
  forceSendEvenIfEmpty?: boolean;
  customTargetChatIds?: string[];
}): Promise<TelegramSendResult> => {
  const {
    space,
    plants,
    gardens,
    members,
    level,
    forceSendEvenIfEmpty,
    customTargetChatIds
  } = params;

  const built = buildSpaceStatusCardContent({ space, plants, gardens, level });

  if (!built.hasDueItems && level !== 'morning' && !forceSendEvenIfEmpty) {
    return { ok: true, sentCount: 0 };
  }

  const targetChatIds =
    customTargetChatIds && customTargetChatIds.length > 0
      ? customTargetChatIds
      : resolveTargetChatIds(space.id, members, 'alerts');

  return await sendTelegramToTargets(
    built.title,
    built.bodyHtml,
    targetChatIds,
    built.inlineKeyboard
  );
};

// ============================================================================
// ۳. کارت شناسنامه گیاه در تلگرام (با پشتیبانی از ویرایش درجا editMessageText)
// ============================================================================
const renderPlantProfileCardInTelegram = async (params: {
  token: string;
  plant: PlantEntity;
  space: SpaceEntity;
  gardenName: string;
  chatId: string;
  messageIdToEdit?: number;
}): Promise<void> => {
  const { token, plant, space, gardenName, chatId, messageIdToEdit } = params;
  const m = CareCalculator.evaluatePlant(plant, space.radiatorOn);

  const statusBadge =
    m.dynamicStatus === 'thirsty'
      ? '🚨 تشنه آبیاری'
      : m.dynamicStatus === 'mist'
      ? '💨 نیازمند غبارپاشی'
      : m.dynamicStatus === 'locked'
      ? `🔒 سیراب (${toPersianNum(m.daysRemaining)} روز مانده)`
      : `✅ کاملاً سیراب (${toPersianNum(m.daysRemaining)} روز تا آبیاری)`;

  const lastLog = plant.history?.[0];
  const title = `🪴 ${plant.name} • پلاک ${plant.code}`;

  const bodyLines: string[] = [
    `📍 ${space.icon} ${space.name} (${gardenName})`,
    `<blockquote>• وضعیت: <b>${statusBadge}</b>\n• رطوبت فعلی بستر: <b>${toPersianNum(
      m.moisturePercent
    )}٪</b>\n• پیمانه دقیق آبیاری: <b>${toPersianNum(
      plant.doseMl
    )} میلی‌لیتر</b> (${plant.doseCup})\n• دوره آبیاری: هر ${toPersianNum(
      m.effectiveCycleDays
    )} روز یک‌بار\n• حجم خاک: ${toPersianNum(
      plant.potVolumeLiters || 2
    )} لیتر • قد: ${toPersianNum(plant.plantHeightCm || 28)} سانتی‌متر</blockquote>`
  ];

  // جزئیات تکمیلی در بلوک تاشوی بازشونده (expandable) تا صفحه شلوغ نشود
  const extraDetails: string[] = [];
  if (plant.mistNeed) extraDetails.push(`💨 <b>غبارپاشی:</b> ${plant.mistNeed}`);
  if (plant.light) extraDetails.push(`☀️ <b>نور:</b> ${plant.light}`);
  if (lastLog) {
    extraDetails.push(
      `🕒 <b>آخرین ثبت:</b> ${lastLog.action.replace(/سی‌سی|cc/gi, 'میلی‌لیتر')} (${lastLog.by})`
    );
  }

  if (extraDetails.length > 0) {
    bodyLines.push(
      `<blockquote expandable>📖 <b>راهنمای نگهداری و آخرین وضعیت:</b>\n${extraDetails.join(
        '\n'
      )}</blockquote>`
    );
  }

  // گرید متقارن ۲ ستونه دکمه‌های عملیاتی گیاه
  const buttons: TelegramInlineButton[][] = [
    [
      {
        text: `💧 ثبت آبیاری (${toPersianNum(plant.doseMl)}ml)`,
        callback_data: `act:w:${plant.id}`
      },
      {
        text: '💨 ثبت غبارپاشی',
        callback_data: `act:m:${plant.id}`
      }
    ],
    [
      {
        text: '🔄 چرخش ۹۰ درجه',
        callback_data: `act:r:${plant.id}`
      },
      {
        text: '🛡️ خاک مرطوب (تعویق)',
        callback_data: `act:s:${plant.id}`
      }
    ],
    [
      {
        text: '✂️ ثبت هرس',
        callback_data: `act:p:${plant.id}`
      },
      {
        text: '🪴 ثبت تعویض خاک',
        callback_data: `act:x:${plant.id}`
      }
    ],
    [
      {
        text: '🔙 فهرست گلدان‌ها',
        callback_data: `list:${space.id}`
      },
      {
        text: '📊 داشبورد گلخانه',
        callback_data: `status:${space.id}`
      }
    ]
  ];

  if (messageIdToEdit) {
    const edited = await editTelegramMessageInPlace({
      token,
      chatId,
      messageId: messageIdToEdit,
      title,
      bodyHtml: bodyLines.join('\n'),
      inlineKeyboard: buttons
    });
    if (edited) return;
  }

  await sendTelegramToTargets(title, bodyLines.join('\n'), [chatId], buttons);
};

// ============================================================================
// ۴. فهرست ۲ ستونه و متقارن گلدان‌ها در تلگرام (با ویرایش درجا editMessageText)
// ============================================================================
const renderSpacePlantsCatalogInTelegram = async (params: {
  token: string;
  space: SpaceEntity;
  plants: PlantEntity[];
  chatId: string;
  messageIdToEdit?: number;
}): Promise<void> => {
  const { token, space, plants, chatId, messageIdToEdit } = params;
  const spPlants = plants.filter(
    (p) => !p.archived && pickStr(p.spaceId, 'office') === space.id
  );

  const rows: TelegramInlineButton[][] = [];
  for (let i = 0; i < spPlants.length; i += 2) {
    const pair: TelegramInlineButton[] = [];
    const p1 = spPlants[i];
    const m1 = CareCalculator.evaluatePlant(p1, space.radiatorOn);
    const ic1 = m1.needsWateringNow ? '💧' : m1.needsMistingNow ? '💨' : '🌿';
    pair.push({
      text: `${ic1} ${p1.name} (${p1.code})`,
      callback_data: `info:${p1.id}`
    });

    if (spPlants[i + 1]) {
      const p2 = spPlants[i + 1];
      const m2 = CareCalculator.evaluatePlant(p2, space.radiatorOn);
      const ic2 = m2.needsWateringNow ? '💧' : m2.needsMistingNow ? '💨' : '🌿';
      pair.push({
        text: `${ic2} ${p2.name} (${p2.code})`,
        callback_data: `info:${p2.id}`
      });
    }
    rows.push(pair);
  }

  rows.push([
    {
      text: `🔙 بازگشت به داشبورد ${space.name}`,
      callback_data: `status:${space.id}`
    }
  ]);

  const title = `🪴 فهرست گلدان‌های «${space.name}»`;
  const bodyHtml = `مجموع گلدان‌های فعال: <b>${toPersianNum(
    spPlants.length
  )} گلدان</b>\n<blockquote>برای مشاهده شناسنامه کامل یا ثبت آبیاری، روی نام گلدان مورد نظر بزنید:</blockquote>`;

  if (messageIdToEdit) {
    const edited = await editTelegramMessageInPlace({
      token,
      chatId,
      messageId: messageIdToEdit,
      title,
      bodyHtml,
      inlineKeyboard: rows
    });
    if (edited) return;
  }

  await sendTelegramToTargets(title, bodyHtml, [chatId], rows);
};

// ============================================================================
// ۵. موتور پردازش سریع دستورات و کلیک‌های درجا در تلگرام
// ============================================================================
let isPollingInProgress = false;

const answerCallbackQuery = async (
  token: string,
  callbackQueryId: string,
  text: string
): Promise<void> => {
  try {
    await fetch(
      `https://greenhouse-bot.sinafallah-ai.workers.dev/bot${token}/answerCallbackQuery`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callback_query_id: callbackQueryId,
          text,
          show_alert: false
        })
      }
    );
  } catch {
    // نادیده گرفتن خطای شبکه
  }
};

const findMemberByChatId = (
  chatId: string,
  members: MemberEntity[],
  defaultChatId: string
): MemberEntity | null => {
  const found = members.find((m) => m.active && pickStr(m.telegramChatId) === chatId);
  if (found) return found;
  if (defaultChatId && chatId === defaultChatId && members.length > 0) {
    return members[0];
  }
  return null;
};

export const pollAndProcessTelegramCommands = async (params: {
  spaces: SpaceEntity[];
  plants: PlantEntity[];
  gardens: GardenEntity[];
  members: MemberEntity[];
  onExecuteRemotePlantAction: (
    plantId: string,
    actionType: CareActionType,
    actorName: string
  ) => void;
  onToggleRemoteSpaceRadiator: (spaceId: string, actorName: string) => void;
  onAutoBindMemberChatId: (memberId: string, chatId: string, username?: string) => void;
}): Promise<void> => {
  if (isPollingInProgress) return;

  const cfg = getCloudConfig();
  const token = pickStr(cfg.telegramBotToken);
  if (!token) return;

  isPollingInProgress = true;

  const {
    spaces,
    plants,
    gardens,
    members,
    onExecuteRemotePlantAction,
    onToggleRemoteSpaceRadiator,
    onAutoBindMemberChatId
  } = params;

  const savedOffsetStr = pickStr(localStorage.getItem(LAST_UPDATE_ID_KEY), '0');
  const lastUpdateId = Number(savedOffsetStr);
  const offsetParam =
    lastUpdateId > 0
      ? `?offset=${lastUpdateId + 1}&limit=25&timeout=1`
      : '?limit=10&timeout=1';

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const res = await fetch(
      `https://greenhouse-bot.sinafallah-ai.workers.dev/bot${token}/getUpdates${offsetParam}`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);
    if (!res.ok) {
      isPollingInProgress = false;
      return;
    }

    const data = await res.json();
    if (!data?.ok || !Array.isArray(data.result) || data.result.length === 0) {
      isPollingInProgress = false;
      return;
    }

    let maxUpdateId = lastUpdateId;
    const defaultChatId = pickStr(cfg.telegramChatId);

    for (const update of data.result) {
      if (update.update_id > maxUpdateId) {
        maxUpdateId = update.update_id;
      }

      const rawMsg = update.message || update.edited_message;
      if (rawMsg?.chat?.id) {
        const cid = String(rawMsg.chat.id);
        const txt: string = pickStr(rawMsg.text);
        let invitedId: string | undefined = undefined;
        if (txt.startsWith('/start join_')) {
          invitedId = txt.replace('/start join_', '').trim();
        }
        const prev = cachedSubscribersMap.get(cid);
        const fullName = [rawMsg.chat.first_name, rawMsg.chat.last_name]
          .filter(Boolean)
          .join(' ');
        const finalInvite = invitedId || prev?.invitedMemberId;

        cachedSubscribersMap.set(cid, {
          chatId: cid,
          firstName: pickStr(fullName, 'کاربر تلگرام'),
          username: rawMsg.chat.username,
          lastText: pickStr(txt, '/start'),
          invitedMemberId: finalInvite
        });
      }

      if (
        lastUpdateId === 0 &&
        data.result.length > 1 &&
        update !== data.result[data.result.length - 1]
      ) {
        continue;
      }

      // الف) پردازش کلیک روی دکمه‌های زیر کارت (همراه با ویرایش درجای همان پیام)
      if (update.callback_query) {
        const cb = update.callback_query;
        const rawChatId = cb.message?.chat?.id || cb.from?.id;
        const chatId = rawChatId ? String(rawChatId) : '';
        const messageId: number | undefined = cb.message?.message_id;
        const cbData: string = pickStr(cb.data);

        const matchedMember = findMemberByChatId(chatId, members, defaultChatId);
        if (!matchedMember) {
          await answerCallbackQuery(token, cb.id, '⛔ حساب شما هنوز متصل نشده است.');
          continue;
        }

        if (cbData.startsWith('act:')) {
          const [, shortCode, plantId] = cbData.split(':');
          const targetPlant = plants.find((p) => p.id === plantId);

          if (!targetPlant) {
            await answerCallbackQuery(token, cb.id, '⚠️ گیاه یافت نشد.');
            continue;
          }

          const plantSpaceId = pickStr(targetPlant.spaceId, 'office');
          const hasAccess =
            matchedMember.role === 'super_admin' ||
            matchedMember.assignedSpaces.includes(plantSpaceId);

          if (!hasAccess) {
            await answerCallbackQuery(token, cb.id, '⛔ عدم دسترسی به این گلخانه.');
            continue;
          }

          const actionMap: Record<string, CareActionType> = {
            w: 'water',
            m: 'mist',
            r: 'rotate',
            s: 'snooze',
            p: 'prune',
            x: 'repot',
            c: 'clean_leaves'
          };
          const actionType: CareActionType = actionMap[shortCode] || 'water';

          onExecuteRemotePlantAction(targetPlant.id, actionType, matchedMember.name);
          await answerCallbackQuery(token, cb.id, `✅ برای «${targetPlant.name}» ثبت شد`);
        } else if (cbData.startsWith('info:')) {
          const plantId = cbData.replace('info:', '');
          const targetPlant = plants.find((p) => p.id === plantId);
          if (targetPlant) {
            const spId = pickStr(targetPlant.spaceId, 'office');
            const sp = spaces.find((s) => s.id === spId) || spaces[0];
            const gName =
              gardens.find((g) => g.id === targetPlant.garden)?.name || 'باغچه اصلی';
            await answerCallbackQuery(token, cb.id, `🪴 ${targetPlant.name}`);
            await renderPlantProfileCardInTelegram({
              token,
              plant: targetPlant,
              space: sp,
              gardenName: gName,
              chatId,
              messageIdToEdit: messageId
            });
          }
        } else if (cbData.startsWith('list:')) {
          const spaceId = cbData.replace('list:', '');
          const targetSpace = spaces.find((s) => s.id === spaceId);
          if (targetSpace) {
            await answerCallbackQuery(token, cb.id, `🪴 فهرست گلدان‌ها`);
            await renderSpacePlantsCatalogInTelegram({
              token,
              space: targetSpace,
              plants,
              chatId,
              messageIdToEdit: messageId
            });
          }
        } else if (cbData.startsWith('rad:')) {
          const spaceId = cbData.replace('rad:', '');
          const targetSpace = spaces.find((s) => s.id === spaceId);
          if (targetSpace) {
            const hasAccess =
              matchedMember.role === 'super_admin' ||
              matchedMember.assignedSpaces.includes(spaceId);
            if (!hasAccess) {
              await answerCallbackQuery(token, cb.id, '⛔ عدم دسترسی.');
              continue;
            }
            onToggleRemoteSpaceRadiator(spaceId, matchedMember.name);
            const toggledSpace: SpaceEntity = {
              ...targetSpace,
              radiatorOn: !targetSpace.radiatorOn
            };
            await answerCallbackQuery(
              token,
              cb.id,
              toggledSpace.radiatorOn ? '🔥 شوفاژ روشن شد' : '🍃 شوفاژ خاموش شد'
            );
            if (messageId) {
              const updatedCard = buildSpaceStatusCardContent({
                space: toggledSpace,
                plants,
                gardens,
                level: 'morning'
              });
              await editTelegramMessageInPlace({
                token,
                chatId,
                messageId,
                title: updatedCard.title,
                bodyHtml: updatedCard.bodyHtml,
                inlineKeyboard: updatedCard.inlineKeyboard
              });
            }
          }
        } else if (cbData.startsWith('status:')) {
          const spaceId = cbData.replace('status:', '');
          const targetSpace = spaces.find((s) => s.id === spaceId);
          if (targetSpace) {
            await answerCallbackQuery(token, cb.id, '🌿 داشبورد گلخانه');
            const built = buildSpaceStatusCardContent({
              space: targetSpace,
              plants,
              gardens,
              level: 'morning'
            });
            if (messageId) {
              const edited = await editTelegramMessageInPlace({
                token,
                chatId,
                messageId,
                title: built.title,
                bodyHtml: built.bodyHtml,
                inlineKeyboard: built.inlineKeyboard
              });
              if (edited) continue;
            }
            await sendTelegramToTargets(
              built.title,
              built.bodyHtml,
              [chatId],
              built.inlineKeyboard
            );
          }
        }
        continue;
      }

      // ب) پردازش پیام‌های متنی و دستورات منوی تلگرام (/start, /status, /plants...)
      const msg = update.message;
      if (!msg?.chat?.id || !msg?.text) continue;

      const chatId = String(msg.chat.id);
      const text = msg.text.trim();

      // به محض دریافت هر پیام متنی، مطمئن شو کیبورد ۴ ردیفه قدیمی جمع شده و منوی رسمی ست شده است
      await ensureLegacyReplyKeyboardCleared(token, chatId);

      if (text.startsWith('/start join_')) {
        const invitedMemId = text.replace('/start join_', '').trim();
        const targetMem = members.find((m) => m.id === invitedMemId);
        if (targetMem) {
          onAutoBindMemberChatId(invitedMemId, chatId, msg.chat.username);
          const allowedSpaces = spaces.filter((s) =>
            targetMem.role === 'super_admin'
              ? true
              : targetMem.assignedSpaces.includes(s.id)
          );
          const firstSp = allowedSpaces[0] || spaces[0];
          const built = buildSpaceStatusCardContent({
            space: firstSp,
            plants,
            gardens,
            level: 'morning'
          });

          await sendTelegramToTargets(
            `✅ خوش آمدید ${targetMem.name} عزیز • حساب شما متصل شد`,
            built.bodyHtml,
            [chatId],
            built.inlineKeyboard,
            true
          );
          continue;
        }
      }

      const matchedMember = findMemberByChatId(chatId, members, defaultChatId);
      if (!matchedMember) {
        await sendTelegramToTargets(
          '🌱 گلخانه کوچک من',
          `شناسه تلگرام شما: <code>${chatId}</code>\nلطفاً لینک دعوت اختصاصی خود را از مدیر گلخانه دریافت نمایید.`,
          [chatId],
          undefined,
          true
        );
        continue;
      }

      const memberSpaces =
        matchedMember.role === 'super_admin'
          ? spaces
          : spaces.filter((s) => matchedMember.assignedSpaces.includes(s.id));

      if (
        text === '/start' ||
        text === '/status' ||
        text === '/thirsty' ||
        text.includes('وضعیت') ||
        text.includes('آبیاری')
      ) {
        for (const sp of memberSpaces) {
          await sendScheduledEscalationReport({
            space: sp,
            plants,
            gardens,
            members,
            level: 'morning',
            forceSendEvenIfEmpty: true,
            customTargetChatIds: [chatId]
          });
        }
      } else if (text === '/plants' || text.includes('شناسنامه')) {
        for (const sp of memberSpaces) {
          await renderSpacePlantsCatalogInTelegram({
            token,
            space: sp,
            plants,
            chatId
          });
        }
      } else if (text === '/history' || text.includes('فعالیت')) {
        for (const sp of memberSpaces) {
          const spPlants = plants.filter(
            (p) => !p.archived && pickStr(p.spaceId, 'office') === sp.id
          );
          const recentLogs: string[] = [];
          spPlants.forEach((p) => {
            if (p.history && p.history.length > 0) {
              const latest = p.history[0];
              recentLogs.push(
                `• <b>${p.name}</b> (<code>${p.code}</code>): ${latest.action.replace(
                  /سی‌سی|cc/gi,
                  'میلی‌لیتر'
                )} — ${latest.by}`
              );
            }
          });
          const body =
            recentLogs.length > 0
              ? `<blockquote>${recentLogs.slice(0, 8).join('\n')}</blockquote>`
              : 'هنوز فعالیتی ثبت نشده است.';

          await sendTelegramToTargets(
            `🕒 آخرین فعالیت‌ها • ${sp.name}`,
            body,
            [chatId]
          );
        }
      } else if (text === '/mist' || text.includes('غبارپاشی')) {
        for (const sp of memberSpaces) {
          const spPlants = plants.filter(
            (p) => !p.archived && pickStr(p.spaceId, 'office') === sp.id
          );
          const mistButtons: TelegramInlineButton[][] = [];
          const lines: string[] = [];
          spPlants.forEach((p) => {
            const m = CareCalculator.evaluatePlant(p, sp.radiatorOn);
            if (m.needsMistingNow) {
              lines.push(`• <b>${p.name}</b> (<code>${p.code}</code>)`);
              mistButtons.push([
                {
                  text: `💨 ثبت غبارپاشی ${p.code}`,
                  callback_data: `act:m:${p.id}`
                },
                {
                  text: `📖 شناسنامه ${p.code}`,
                  callback_data: `info:${p.id}`
                }
              ]);
            }
          });
          await sendTelegramToTargets(
            `💨 نوبت غبارپاشی • ${sp.name}`,
            lines.length > 0
              ? lines.join('\n')
              : '✨ امروز هیچ گلدانی نیاز به غبارپاشی ندارد.',
            [chatId],
            mistButtons
          );
        }
      } else if (text === '/rotate' || text.includes('چرخش')) {
        for (const sp of memberSpaces) {
          const spPlants = plants.filter(
            (p) => !p.archived && pickStr(p.spaceId, 'office') === sp.id
          );
          const rotButtons: TelegramInlineButton[][] = [];
          const lines: string[] = [];
          spPlants.forEach((p) => {
            const m = CareCalculator.evaluatePlant(p, sp.radiatorOn);
            if (m.needsQuarterTurn) {
              lines.push(`• <b>${p.name}</b> (<code>${p.code}</code>)`);
              rotButtons.push([
                {
                  text: `🔄 چرخش ۹۰° ${p.code}`,
                  callback_data: `act:r:${p.id}`
                },
                {
                  text: `📖 شناسنامه ${p.code}`,
                  callback_data: `info:${p.id}`
                }
              ]);
            }
          });
          await sendTelegramToTargets(
            `🔄 نوبت چرخش ۹۰ درجه • ${sp.name}`,
            lines.length > 0
              ? lines.join('\n')
              : '✨ تمام گلدان‌ها متقارن هستند.',
            [chatId],
            rotButtons
          );
        }
      } else if (text === '/radiator' || text.includes('شوفاژ')) {
        const radButtons: TelegramInlineButton[][] = memberSpaces.map((sp) => [
          {
            text: `${sp.icon} ${sp.name}: ${
              sp.radiatorOn ? '🔥 روشن (خاموش کردن)' : '🍃 خاموش (روشن کردن)'
            }`,
            callback_data: `rad:${sp.id}`
          }
        ]);
        await sendTelegramToTargets(
          '🔥 مدیریت گرمایش شوفاژ',
          'برای تغییر وضعیت شوفاژ گلخانه روی دکمه زیر بزنید:',
          [chatId],
          radButtons
        );
      }
    }

    if (maxUpdateId > lastUpdateId) {
      localStorage.setItem(LAST_UPDATE_ID_KEY, String(maxUpdateId));
    }
  } catch {
    clearTimeout(timeoutId);
  } finally {
    isPollingInProgress = false;
  }
};

export const requestBrowserPushPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) return false;
  const permission = await Notification.requestPermission();
  return permission === 'granted';
};