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
const ROOM_ID = 'sina_office_greenhouse';

// توابع کمکی ایمن برای انتخاب اولین رشته پر و ترکیب شرط‌ها
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

// کیبورد جامع، مینیمال و فارسی پایین صفحه تلگرام (۸ کلید مدیریتی)
export const TELEGRAM_MAIN_REPLY_KEYBOARD = {
  keyboard: [
    [{ text: '📊 وضعیت گلخانه' }, { text: '💧 آبیاری امروز' }],
    [{ text: '💦 غبارپاشی' }, { text: '🔄 چرخش گلدان' }],
    [{ text: '🪴 شناسنامه گیاهان' }, { text: '📅 آخرین فعالیت‌ها' }],
    [{ text: '🌡️ وضعیت شوفاژ' }, { text: '👤 دسترسی من' }]
  ],
  resize_keyboard: true,
  is_persistent: true
};

// تابع کپی ضدخطا برای تمام مرورگرهای موبایل و دسکتاپ
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
  if (!cfg.supabaseUrl) return null;
  if (!cfg.supabaseAnonKey) return null;
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

  if (error) return null;
  if (!data?.payload) return null;

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
  if (!token) {
    return fallbackUsername ? fallbackUsername : null;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500);

  try {
    const res = await fetch(`https://greenhouse-bot.sinafallah-ai.workers.dev/bot${token}/getMe`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!res.ok) {
      return fallbackUsername ? fallbackUsername : null;
    }
    const data = await res.json();
    const username: string = pickStr(data?.result?.username);
    if (username) {
      saveCloudConfig({ ...cfg, telegramBotUsername: username });
      return username;
    }
    return fallbackUsername ? fallbackUsername : null;
  } catch {
    clearTimeout(timeoutId);
    return fallbackUsername ? fallbackUsername : null;
  }
};

// ثبت منوی رسمی دستورات در تلگرام
export const setupTelegramBotCommands = async (customToken?: string): Promise<boolean> => {
  const cfg = getCloudConfig();
  const token = pickStr(customToken, cfg.telegramBotToken);
  if (!token) return false;

  try {
    const commands = [
      { command: 'status', description: 'وضعیت گلخانه' },
      { command: 'thirsty', description: 'آبیاری امروز' },
      { command: 'mist', description: 'نوبت غبارپاشی' },
      { command: 'rotate', description: 'نوبت چرخش گلدان' },
      { command: 'plants', description: 'شناسنامه و مدیریت گیاهان' },
      { command: 'history', description: 'گزارش آخرین فعالیت‌ها' },
      { command: 'radiator', description: 'وضعیت شوفاژ' }
    ];

    const res = await fetch(`https://greenhouse-bot.sinafallah-ai.workers.dev/bot${token}/setMyCommands`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commands })
    });
    return res.ok;
  } catch {
    return false;
  }
};

// کش مشترک کاربران ربات برای جلوگیری از تداخل Offset با حلقه اصلی
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
    const res = await fetch(`https://greenhouse-bot.sinafallah-ai.workers.dev/bot${token}/getUpdates?limit=30`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!res.ok) return Array.from(cachedSubscribersMap.values());
    const data = await res.json();
    if (data?.ok && Array.isArray(data.result)) {
      for (const item of data.result) {
        const msg = item.message
          ? item.message
          : item.edited_message
          ? item.edited_message
          : item.my_chat_member;
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
          const finalInvite = invitedMemberId ? invitedMemberId : prev?.invitedMemberId;

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
    const hasSpaceAccess = isSuper ? true : isAssigned;
    if (!hasSpaceAccess) return;

    if (mode === 'alerts' && m.notifyAlerts) {
      targets.add(chatId);
    }
    if (mode === 'actions' && m.notifyActions) {
      targets.add(chatId);
    }
  });

  const fallbackChatId = pickStr(cfg.telegramChatId);
  if (targets.size === 0 && fallbackChatId) {
    targets.add(fallbackChatId);
  }

  return Array.from(targets);
};

// ارسال پیام به تلگرام با قالب مینیمال، تمیز و بدون تگ‌های شلوغ
export const sendTelegramToTargets = async (
  title: string,
  bodyHtml: string,
  targetChatIds?: string[],
  inlineKeyboard?: TelegramInlineButton[][],
  useMainReplyKeyboard: boolean = false
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

  let replyMarkup: Record<string, unknown> | undefined = undefined;
  if (inlineKeyboard && inlineKeyboard.length > 0) {
    replyMarkup = { inline_keyboard: inlineKeyboard };
  } else if (useMainReplyKeyboard) {
    replyMarkup = TELEGRAM_MAIN_REPLY_KEYBOARD;
  }

  let sentCount = 0;
  for (const chatId of chatIds) {
    try {
      const payload: Record<string, unknown> = {
        chat_id: chatId,
        text: htmlMessage,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      };
      if (replyMarkup) {
        payload.reply_markup = replyMarkup;
      }

      const res = await fetch(`https://greenhouse-bot.sinafallah-ai.workers.dev/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
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

// ۱. گزارش مینیمال و تمیز ثبت عملیات (بدون فونت ایتالیک و بدون شلوغی)
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

  let actionTitle = '';
  let doseLine = '';
  let nextLine = '';
  const repotMonths = plant.repotCycleMonths ? plant.repotCycleMonths : 16;

  if (actionType === 'water') {
    actionTitle = plant.fertDue ? '💧 ثبت آبیاری و کوددهی' : '💧 ثبت آبیاری';
    doseLine = `پیمانه: <code>${toPersianNum(plant.doseMl)} سی‌سی</code> (${plant.doseCup})`;
    nextLine = `نوبت بعدی: ${toPersianNum(metrics.effectiveCycleDays)} روز دیگر`;
  } else if (actionType === 'mist') {
    actionTitle = '💦 ثبت غبارپاشی برگ‌ها';
    doseLine = 'رطوبت‌رسانی برگ‌ها انجام شد';
    nextLine = `موعد آبیاری خاک: ${metrics.nextWateringText}`;
  } else if (actionType === 'rotate') {
    actionTitle = '🔄 ثبت چرخش ۹۰ درجه';
    doseLine = 'تنظیم تقارن نور گلدان';
    nextLine = 'چرخش بعدی: ۲ نوبت آبیاری دیگر';
  } else if (actionType === 'prune') {
    actionTitle = '✂️ ثبت هرس و فرم‌دهی';
    doseLine = 'اصلاح شاخ و برگ انجام شد';
    nextLine = `وضعیت رطوبت خاک: ${toPersianNum(metrics.moisturePercent)}٪`;
  } else if (actionType === 'repot') {
    actionTitle = '🪴 ثبت تعویض خاک';
    doseLine = 'بستر خاک و زهکشی نوسازی شد';
    nextLine = `تعویض بعدی: ${toPersianNum(repotMonths)} ماه دیگر`;
  } else if (actionType === 'clean_leaves') {
    actionTitle = '✨ ثبت غبارروبی برگ‌ها';
    doseLine = 'پاکسازی منافذ تنفسی برگ انجام شد';
    nextLine = 'غبارروبی بعدی: ۱ ماه دیگر';
  } else {
    actionTitle = '⏳ تعویق آبیاری (خاک مرطوب)';
    doseLine = 'خاک بررسی شد و هنوز نم‌دار است';
    nextLine = 'بررسی مجدد: ۲ روز دیگر';
  }

  const actorLabel = sourceLabel ? `${actor} • ${sourceLabel}` : actor;

  const lines: string[] = [
    `🪴 <b>${plant.name}</b>  <code>${plant.code}</code>`,
    `${space.icon} ${space.name} • ${gardenName}`,
    ''
  ];

  if (doseLine) lines.push(`• ${doseLine}`);
  if (nextLine) lines.push(`• ${nextLine}`);
  if (note) lines.push(`• یادداشت: ${note}`);
  lines.push('');
  lines.push(`👤 ${actorLabel} • ساعت ${nowTime}`);

  const inlineButtons: TelegramInlineButton[][] = [
    [
      {
        text: `🪴 شناسنامه ${plant.name}`,
        callback_data: `info:${plant.id}`
      },
      {
        text: `📊 وضعیت ${space.name}`,
        callback_data: `status:${space.id}`
      }
    ]
  ];

  const targetChatIds = resolveTargetChatIds(space.id, members, 'actions');
  return await sendTelegramToTargets(
    actionTitle,
    lines.join('\n'),
    targetChatIds,
    inlineButtons
  );
};

// ۲. گزارش مینیمال و ساختاریافته وضعیت گلخانه (همراه با دکمه‌های شیشه‌ای مستقیم)
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

  const spacePlants = plants.filter((p) => {
    if (p.archived) return false;
    const spId = pickStr(p.spaceId, 'office');
    return spId === space.id;
  });

  const persianToday = formatPersianDate(0);

  const thirstyList: string[] = [];
  const mistList: string[] = [];
  const rotateList: string[] = [];
  const inlineKeyboard: TelegramInlineButton[][] = [];

  spacePlants.forEach((p) => {
    const gObj = gardens.find((g) => g.id === p.garden);
    const m = CareCalculator.evaluatePlant(p, space.radiatorOn, new Date(), gObj);

    if (m.needsWateringNow) {
      const fertTag = p.fertDue ? ' + کود' : '';
      thirstyList.push(
        `• <b>${p.name}</b>  <code>${toPersianNum(p.doseMl)} سی‌سی</code> (${p.doseCup}${fertTag})`
      );
      if (inlineKeyboard.length < 8) {
        inlineKeyboard.push([
          {
            text: `💧 آبیاری ${p.name} (${toPersianNum(p.doseMl)}cc)`,
            callback_data: `act:w:${p.id}`
          },
          {
            text: '⏳ خاک مرطوب',
            callback_data: `act:s:${p.id}`
          }
        ]);
      }
    }

    if (m.needsMistingNow) {
      mistList.push(`• <b>${p.name}</b>  <code>${p.code}</code>`);
      if (inlineKeyboard.length < 8 && !m.needsWateringNow) {
        inlineKeyboard.push([
          {
            text: `💦 غبارپاشی ${p.name}`,
            callback_data: `act:m:${p.id}`
          }
        ]);
      }
    }

    if (m.needsQuarterTurn) {
      rotateList.push(`• <b>${p.name}</b>  <code>${p.code}</code>`);
      if (inlineKeyboard.length < 8 && !m.needsWateringNow && !m.needsMistingNow) {
        inlineKeyboard.push([
          {
            text: `🔄 چرخش ${p.name}`,
            callback_data: `act:r:${p.id}`
          }
        ]);
      }
    }
  });

  inlineKeyboard.push([
    {
      text: space.radiatorOn ? '🔥 شوفاژ: روشن' : '🍃 شوفاژ: خاموش',
      callback_data: `rad:${space.id}`
    },
    {
      text: '🪴 لیست همه گیاهان',
      callback_data: `list:${space.id}`
    }
  ]);

  const targetChatIds =
    customTargetChatIds && customTargetChatIds.length > 0
      ? customTargetChatIds
      : resolveTargetChatIds(space.id, members, 'alerts');

  const isAllClean =
    thirstyList.length === 0 && mistList.length === 0 && rotateList.length === 0;

  if (isAllClean) {
    const shouldSendEmpty = level === 'morning' ? true : Boolean(forceSendEvenIfEmpty);
    if (shouldSendEmpty) {
      const cleanEmptyBody = [
        `📅 ${persianToday}`,
        '',
        `✨ تمام <b>${toPersianNum(spacePlants.length)} گلدان</b> سیراب و متقارن هستند و امروز نیازی به رسیدگی ندارند.`,
        '',
        `🌡️ شوفاژ: <b>${space.radiatorOn ? 'روشن' : 'خاموش'}</b>`
      ].join('\n');

      return await sendTelegramToTargets(
        `${space.icon} ${space.name}`,
        cleanEmptyBody,
        targetChatIds,
        inlineKeyboard
      );
    }
    return { ok: true, sentCount: 0 };
  }

  const headerTitle =
    level === 'morning'
      ? `${space.icon} ${space.name}`
      : `🔔 یادآور ظهر • ${space.name}`;

  const sections: string[] = [`📅 ${persianToday}`, ''];

  if (thirstyList.length > 0) {
    sections.push(`💧 <b>آبیاری امروز (${toPersianNum(thirstyList.length)})</b>`);
    sections.push(...thirstyList);
    sections.push('');
  }

  if (mistList.length > 0) {
    sections.push(`💦 <b>غبارپاشی (${toPersianNum(mistList.length)})</b>`);
    sections.push(...mistList);
    sections.push('');
  }

  if (rotateList.length > 0) {
    sections.push(`🔄 <b>چرخش ۹۰ درجه (${toPersianNum(rotateList.length)})</b>`);
    sections.push(...rotateList);
    sections.push('');
  }

  sections.push(`🌡️ شوفاژ: <b>${space.radiatorOn ? 'روشن' : 'خاموش'}</b>`);

  return await sendTelegramToTargets(
    headerTitle,
    sections.join('\n'),
    targetChatIds,
    inlineKeyboard
  );
};

// ۳. ارسال کارت شناسنامه و پنل مدیریت اختصاصی یک گیاه در داخل تلگرام
const sendPlantInteractiveCardToTelegram = async (params: {
  plant: PlantEntity;
  space: SpaceEntity;
  gardenName: string;
  chatId: string;
}): Promise<void> => {
  const { plant, space, gardenName, chatId } = params;
  const m = CareCalculator.evaluatePlant(plant, space.radiatorOn);

  const statusLabel =
    m.dynamicStatus === 'thirsty'
      ? '🚨 تشنه (نیازمند آبیاری)'
      : m.dynamicStatus === 'mist'
      ? '💦 نیازمند غبارپاشی'
      : m.dynamicStatus === 'locked'
      ? `🔒 سیراب و قفل (${toPersianNum(m.daysRemaining)} روز مانده)`
      : m.dynamicStatus === 'recovery'
      ? '🩺 دوره نقاهت پس از هرس'
      : `✅ سیراب (${toPersianNum(m.daysRemaining)} روز تا آبیاری بعدی)`;

  const lastLog = plant.history[0];
  const heightCm = plant.plantHeightCm ? plant.plantHeightCm : 25;

  const lines: string[] = [
    `${space.icon} ${space.name} • ${gardenName}`,
    `• وضعیت: <b>${statusLabel}</b>`,
    `• رطوبت خاک: <code>${toPersianNum(m.moisturePercent)}٪</code>`,
    `• پیمانه آب: <code>${toPersianNum(plant.doseMl)} سی‌سی</code> (${plant.doseCup})`,
    `• دوره آبیاری: هر ${toPersianNum(m.effectiveCycleDays)} روز`,
    `• رطوبت برگ: ${plant.mistNeed}`
  ];

  if (plant.potVolumeLiters) {
    lines.push(
      `• مشخصات گلدان: حجم ${toPersianNum(plant.potVolumeLiters)} لیتر • قد ${toPersianNum(heightCm)}cm`
    );
  }
  if (lastLog) {
    lines.push(`• آخرین اقدام: ${lastLog.action} (${lastLog.by})`);
  }

  const buttons: TelegramInlineButton[][] = [
    [
      {
        text: `💧 ثبت آبیاری (${toPersianNum(plant.doseMl)}cc)`,
        callback_data: `act:w:${plant.id}`
      },
      {
        text: '💦 ثبت غبارپاشی',
        callback_data: `act:m:${plant.id}`
      }
    ],
    [
      {
        text: '🔄 ثبت چرخش ۹۰°',
        callback_data: `act:r:${plant.id}`
      },
      {
        text: '⏳ خاک مرطوب (تعویق)',
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
        text: `🔙 بازگشت به لیست ${space.name}`,
        callback_data: `list:${space.id}`
      }
    ]
  ];

  await sendTelegramToTargets(
    `🪴 ${plant.name} (${plant.code})`,
    lines.join('\n'),
    [chatId],
    buttons
  );
};

// ۴. ارسال فهرست دکمه‌ای تمام گیاهان یک گلخانه در داخل تلگرام
const sendSpacePlantsCatalogToTelegram = async (params: {
  space: SpaceEntity;
  plants: PlantEntity[];
  chatId: string;
}): Promise<void> => {
  const { space, plants, chatId } = params;
  const spPlants = plants.filter((p) => {
    if (p.archived) return false;
    const spId = pickStr(p.spaceId, 'office');
    return spId === space.id;
  });

  const rows: TelegramInlineButton[][] = [];
  for (let i = 0; i < spPlants.length; i += 2) {
    const pair: TelegramInlineButton[] = [];
    const p1 = spPlants[i];
    const m1 = CareCalculator.evaluatePlant(p1, space.radiatorOn);
    const icon1 = m1.needsWateringNow ? '💧' : m1.needsMistingNow ? '💦' : '🌿';
    pair.push({
      text: `${icon1} ${p1.name} (${p1.code})`,
      callback_data: `info:${p1.id}`
    });

    if (spPlants[i + 1]) {
      const p2 = spPlants[i + 1];
      const m2 = CareCalculator.evaluatePlant(p2, space.radiatorOn);
      const icon2 = m2.needsWateringNow ? '💧' : m2.needsMistingNow ? '💦' : '🌿';
      pair.push({
        text: `${icon2} ${p2.name} (${p2.code})`,
        callback_data: `info:${p2.id}`
      });
    }
    rows.push(pair);
  }

  await sendTelegramToTargets(
    `🪴 فهرست گیاهان • ${space.name}`,
    `مجموع گلدان‌های فعال: <b>${toPersianNum(spPlants.length)} گلدان</b>\nبرای مشاهده شناسنامه یا ثبت عملیات روی گلدان مورد نظر بزنید:`,
    [chatId],
    rows
  );
};

// ============================================================================
// ۵. موتور پردازش سریع دستورات و دکمه‌های تلگرام (Fast Polling)
// ============================================================================
let isPollingInProgress = false;

const answerCallbackQuery = async (
  token: string,
  callbackQueryId: string,
  text: string
): Promise<void> => {
  try {
    await fetch(`https://greenhouse-bot.sinafallah-ai.workers.dev/bot${token}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callback_query_id: callbackQueryId,
        text,
        show_alert: false
      })
    });
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
    const res = await fetch(`https://greenhouse-bot.sinafallah-ai.workers.dev/bot${token}/getUpdates${offsetParam}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!res.ok) {
      isPollingInProgress = false;
      return;
    }

    const data = await res.json();
    if (!data?.ok) {
      isPollingInProgress = false;
      return;
    }
    if (!Array.isArray(data.result) || data.result.length === 0) {
      isPollingInProgress = false;
      return;
    }

    let maxUpdateId = lastUpdateId;
    const defaultChatId = pickStr(cfg.telegramChatId);

    for (const update of data.result) {
      if (update.update_id > maxUpdateId) {
        maxUpdateId = update.update_id;
      }

      const rawMsg = update.message ? update.message : update.edited_message;
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
        const finalInvite = invitedId ? invitedId : prev?.invitedMemberId;

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

      // الف) پردازش کلیک روی دکمه‌های شیشه‌ای (Inline Callback Queries)
      if (update.callback_query) {
        const cb = update.callback_query;
        const rawChatId = cb.message?.chat?.id ? cb.message.chat.id : cb.from?.id;
        const chatId = rawChatId ? String(rawChatId) : '';
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
          const isSuper = matchedMember.role === 'super_admin';
          const isAssigned = matchedMember.assignedSpaces.includes(plantSpaceId);
          const hasAccess = isSuper ? true : isAssigned;

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
          const mappedAction = actionMap[shortCode];
          const actionType: CareActionType = mappedAction ? mappedAction : 'water';

          onExecuteRemotePlantAction(targetPlant.id, actionType, matchedMember.name);
          await answerCallbackQuery(token, cb.id, `✅ برای «${targetPlant.name}» ثبت شد`);
        } else if (cbData.startsWith('info:')) {
          const plantId = cbData.replace('info:', '');
          const targetPlant = plants.find((p) => p.id === plantId);
          if (targetPlant) {
            const spId = pickStr(targetPlant.spaceId, 'office');
            const foundSp = spaces.find((s) => s.id === spId);
            const sp = foundSp ? foundSp : spaces[0];
            const foundGarden = gardens.find((g) => g.id === targetPlant.garden);
            const gName = foundGarden ? foundGarden.name : 'باغچه اصلی';
            await answerCallbackQuery(token, cb.id, `🪴 شناسنامه ${targetPlant.name}`);
            await sendPlantInteractiveCardToTelegram({
              plant: targetPlant,
              space: sp,
              gardenName: gName,
              chatId
            });
          }
        } else if (cbData.startsWith('list:')) {
          const spaceId = cbData.replace('list:', '');
          const targetSpace = spaces.find((s) => s.id === spaceId);
          if (targetSpace) {
            await answerCallbackQuery(token, cb.id, `🪴 لیست گیاهان ${targetSpace.name}`);
            await sendSpacePlantsCatalogToTelegram({
              space: targetSpace,
              plants,
              chatId
            });
          }
        } else if (cbData.startsWith('rad:')) {
          const spaceId = cbData.replace('rad:', '');
          const targetSpace = spaces.find((s) => s.id === spaceId);
          if (targetSpace) {
            const isSuper = matchedMember.role === 'super_admin';
            const isAssigned = matchedMember.assignedSpaces.includes(spaceId);
            const hasAccess = isSuper ? true : isAssigned;
            if (!hasAccess) {
              await answerCallbackQuery(token, cb.id, '⛔ عدم دسترسی.');
              continue;
            }
            onToggleRemoteSpaceRadiator(spaceId, matchedMember.name);
            await answerCallbackQuery(token, cb.id, '🌡️ وضعیت شوفاژ تغییر کرد');
          }
        } else if (cbData.startsWith('status:')) {
          const spaceId = cbData.replace('status:', '');
          const targetSpace = spaces.find((s) => s.id === spaceId);
          if (targetSpace) {
            await answerCallbackQuery(token, cb.id, '📊 ارسال گزارش...');
            await sendScheduledEscalationReport({
              space: targetSpace,
              plants,
              gardens,
              members,
              level: 'morning',
              forceSendEvenIfEmpty: true,
              customTargetChatIds: [chatId]
            });
          }
        }
        continue;
      }

      // ب) پردازش پیام‌های متنی و کلیدهای کیبورد فارسی
      const msg = update.message;
      if (!msg) continue;
      if (!msg.chat?.id) continue;
      if (!msg.text) continue;

      const chatId = String(msg.chat.id);
      const text = msg.text.trim();

      if (text.startsWith('/start join_')) {
        const invitedMemId = text.replace('/start join_', '').trim();
        const targetMem = members.find((m) => m.id === invitedMemId);
        if (targetMem) {
          onAutoBindMemberChatId(invitedMemId, chatId, msg.chat.username);
          const allowedSpacesNames = spaces
            .filter((s) =>
              targetMem.role === 'super_admin'
                ? true
                : targetMem.assignedSpaces.includes(s.id)
            )
            .map((s) => `${s.icon} ${s.name}`)
            .join(' ، ');

          await sendTelegramToTargets(
            `✅ اتصال موفق • ${targetMem.name}`,
            [
              'حساب تلگرام شما به گلخانه متصل شد.',
              `• گلخانه: <b>${allowedSpacesNames}</b>`,
              '',
              'از دکمه‌های پایین صفحه برای مدیریت استفاده کنید:'
            ].join('\n'),
            [chatId],
            undefined,
            true
          );
          continue;
        }
      }

      const matchedMember = findMemberByChatId(chatId, members, defaultChatId);

      if (!matchedMember) {
        await sendTelegramToTargets(
          '🌱 گلخانه کوچک من',
          `کد تلگرام شما: <code>${chatId}</code>\nلطفاً لینک دعوت را از مدیر گلخانه دریافت کنید.`,
          [chatId]
        );
        continue;
      }

      const memberSpaces =
        matchedMember.role === 'super_admin'
          ? spaces
          : spaces.filter((s) => matchedMember.assignedSpaces.includes(s.id));

      const isProfileCommand =
        text === '/start' ? true : text === '/help' ? true : text.includes('دسترسی من');

      const isStatusCommand =
        text === '/status'
          ? true
          : text === '/thirsty'
          ? true
          : text.includes('وضعیت گلخانه')
          ? true
          : text.includes('آبیاری امروز')
          ? true
          : text.includes('گیاهان تشنه');

      const isCatalogCommand =
        text === '/plants' ? true : text.includes('شناسنامه گیاهان');

      const isHistoryCommand =
        text === '/history' ? true : text.includes('آخرین فعالیت');

      const isMistCommand = text === '/mist' ? true : text.includes('غبارپاشی');

      const isRotateCommand = text === '/rotate' ? true : text.includes('چرخش');

      const isRadiatorCommand = text === '/radiator' ? true : text.includes('شوفاژ');

      if (isProfileCommand) {
        const spaceTitles = memberSpaces.map((s) => `${s.icon} ${s.name}`).join(' ، ');
        const roleTitle =
          matchedMember.role === 'super_admin'
            ? 'مالک ارشد'
            : matchedMember.role === 'space_admin'
            ? 'مدیر گلخانه'
            : 'همیار مراقبت';

        await sendTelegramToTargets(
          `👤 ${matchedMember.name}`,
          [`• نقش: <b>${roleTitle}</b>`, `• گلخانه: <b>${spaceTitles}</b>`].join('\n'),
          [chatId],
          undefined,
          true
        );
      } else if (isStatusCommand) {
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
      } else if (isCatalogCommand) {
        for (const sp of memberSpaces) {
          await sendSpacePlantsCatalogToTelegram({
            space: sp,
            plants,
            chatId
          });
        }
      } else if (isHistoryCommand) {
        for (const sp of memberSpaces) {
          const spPlants = plants.filter((p) => {
            if (p.archived) return false;
            const spId = pickStr(p.spaceId, 'office');
            return spId === sp.id;
          });

          const recentLogs: Array<{
            plantName: string;
            code: string;
            action: string;
            by: string;
            date: string;
          }> = [];

          spPlants.forEach((p) => {
            if (p.history && p.history.length > 0) {
              const latest = p.history[0];
              recentLogs.push({
                plantName: p.name,
                code: p.code,
                action: latest.action,
                by: latest.by,
                date: pickStr(latest.persianDate, latest.time)
              });
            }
          });

          const topLogs = recentLogs.slice(0, 8);
          const body =
            topLogs.length > 0
              ? topLogs
                  .map(
                    (l) =>
                      `• <b>${l.plantName}</b> (<code>${l.code}</code>)\n   └ ${l.action} • ${l.by} (${l.date})`
                  )
                  .join('\n')
              : 'هنوز فعالیتی ثبت نشده است.';

          await sendTelegramToTargets(
            `📅 آخرین فعالیت‌ها • ${sp.name}`,
            body,
            [chatId]
          );
        }
      } else if (isMistCommand) {
        for (const sp of memberSpaces) {
          const spPlants = plants.filter((p) => {
            if (p.archived) return false;
            const spId = pickStr(p.spaceId, 'office');
            return spId === sp.id;
          });
          const mistButtons: TelegramInlineButton[][] = [];
          const lines: string[] = [];

          spPlants.forEach((p) => {
            const m = CareCalculator.evaluatePlant(p, sp.radiatorOn);
            if (m.needsMistingNow) {
              lines.push(`• <b>${p.name}</b>  <code>${p.code}</code>`);
              mistButtons.push([
                {
                  text: `💦 ثبت غبارپاشی ${p.name}`,
                  callback_data: `act:m:${p.id}`
                }
              ]);
            }
          });

          const body =
            lines.length > 0
              ? lines.join('\n')
              : '✨ امروز هیچ گلدانی نیاز به غبارپاشی ندارد.';

          await sendTelegramToTargets(
            `💦 غبارپاشی • ${sp.name}`,
            body,
            [chatId],
            mistButtons
          );
        }
      } else if (isRotateCommand) {
        for (const sp of memberSpaces) {
          const spPlants = plants.filter((p) => {
            if (p.archived) return false;
            const spId = pickStr(p.spaceId, 'office');
            return spId === sp.id;
          });
          const rotButtons: TelegramInlineButton[][] = [];
          const lines: string[] = [];

          spPlants.forEach((p) => {
            const m = CareCalculator.evaluatePlant(p, sp.radiatorOn);
            if (m.needsQuarterTurn) {
              lines.push(`• <b>${p.name}</b>  <code>${p.code}</code>`);
              rotButtons.push([
                {
                  text: `🔄 ثبت چرخش ${p.name}`,
                  callback_data: `act:r:${p.id}`
                }
              ]);
            }
          });

          const body =
            lines.length > 0
              ? lines.join('\n')
              : '✨ تمام گلدان‌ها متقارن هستند.';

          await sendTelegramToTargets(
            `🔄 چرخش ۹۰ درجه • ${sp.name}`,
            body,
            [chatId],
            rotButtons
          );
        }
      } else if (isRadiatorCommand) {
        const radButtons: TelegramInlineButton[][] = memberSpaces.map((sp) => [
          {
            text: `${sp.icon} ${sp.name}: ${
              sp.radiatorOn ? '🔥 روشن (تغییر به خاموش)' : '🍃 خاموش (تغییر به روشن)'
            }`,
            callback_data: `rad:${sp.id}`
          }
        ]);

        await sendTelegramToTargets(
          '🌡️ وضعیت شوفاژ',
          'برای تغییر وضعیت شوفاژ روی دکمه زیر بزنید:',
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